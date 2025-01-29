from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import pymongo
import sys
from bson import ObjectId
import numpy as np
from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv()  

openai_api_key = os.getenv("OPENAI_API_KEY")
mongo_uri = os.getenv("MONGO")

# MongoDB connection function
def connect_to_mongo():
    try:
        # Replace with your MongoDB connection URI and credentials
        client = pymongo.MongoClient("mongodb+srv://shivam:wlcshivam@wlc-shivam.rwktud3.mongodb.net/test2careerexplorer?retryWrites=true&w=majority&appName=wlc-shivam")

        # Test the connection
        client.admin.command('ping')
        print("MongoDB connection successful")

        return client
    except pymongo.errors.ConnectionFailure as e:
        print(f"MongoDB connection failed: {e}")
        return None

# Function to fetch DISC scores
def fetch_disc_scores(client, user_id):
    try:
        db = client['test2careerexplorer']
        disc_collection = db['discprofiles']

        disc_details = disc_collection.find_one({"userId": ObjectId(user_id)})

        if disc_details:
            scores = disc_details.get('scores', {})
            disc_score = {
                "most": scores.get('most', {}),
                "least": scores.get('least', {}),
                "difference": scores.get('difference', {})
            }
            return disc_score
        else:
            print(f"No DISC scores found for user ID: {user_id}")
            return {}
    except Exception as e:
        print(f"Error fetching DISC scores: {e}")
        return {}

# Function to fetch RAISEC results
def fetch_raisec_results(client, user_id):
    if not client:
        return None

    db = client['test2careerexplorer']
    interest_profiles_collection = db['interestprofiles']

    user_doc = interest_profiles_collection.find_one({"userId": ObjectId(user_id)})

    if not user_doc:
        print(f"No document found for userId: {user_id}")
        return None

    raisec_results = {"areas": []}

    results = user_doc.get('results', {}).get('result', [])
    for item in results:
        raisec_results["areas"].append({
            "area": item.get("area"),
            "score": item.get("score")
        })

    return raisec_results

# Function to fetch user data from 'users', 'surveys', DISC, and RAISEC collections
def fetch_user_info(client, user_id):
    db = client['test2careerexplorer']

    users_collection = db['users']
    user_details = users_collection.find_one({"_id": ObjectId(user_id)})

    first_name = user_details.get('firstName', 'User') if user_details else 'User'
    last_name = user_details.get('lastName', '') if user_details else ''

    surveys_collection = db['surveys']
    survey_details = surveys_collection.find_one({"userId": ObjectId(user_id)})

    disc_score = fetch_disc_scores(client, user_id)

    raisec_results = fetch_raisec_results(client, user_id)

    if survey_details:
        education_level = survey_details.get('educationLevel')
        grade_points = survey_details.get('gradePoints')
        next_career_step = survey_details.get('nextCareerStep')
        most_appealing_field = survey_details.get('mostAppealingField', [])
        preferred_location = survey_details.get('preferredLocation', [])
        top_3_things_for_future = survey_details.get('top3thingsForFuture', [])
        nationality = survey_details.get('nationality')
        selected_pathways = survey_details.get('selectedPathways', [])

        return {
            'first_name': first_name,
            'last_name': last_name,
            'education_level': education_level,
            'grade_points': grade_points,
            'next_career_step': next_career_step,
            'most_appealing_field': most_appealing_field,
            'preferred_location': preferred_location,
            'top_3_things_for_future': top_3_things_for_future,
            'nationality': nationality,
            'selected_pathways': selected_pathways,
            'disc_score': disc_score,
            'raisec_results': raisec_results
        }
    else:
        print(f"No survey data found for user ID: {user_id}")
        return None

# Function to summarize student personality and interests
def summarize_student(client, user_id):
    user_info = fetch_user_info(client, user_id)
    db = client['test2careerexplorer']
    interest_profiles = db['interestprofiles']
    interest_profile = interest_profiles.find_one({"userId": ObjectId(user_id)})

    if interest_profile and 'careers' in interest_profile:
        top_20_jobs = interest_profile['careers']['career'][:20]

        all_job_course_summaries = {}

        for job in top_20_jobs:
            job_code = job.get('code')
            job_title = job.get('title')

            if user_info:
                client_openai = OpenAI()

                prompt = (
                    f"The student has the following details:\n"
                    f"Name: {user_info['first_name']} {user_info['last_name']}\n"
                    f"Education Level: {user_info['education_level']}\n"
                    f"Grade Points: {user_info['grade_points']}\n"
                    f"Next Career Step: {user_info['next_career_step']}\n"
                    f"Most Appealing Field: {', '.join(user_info['most_appealing_field'])}\n"
                    f"Preferred Location: {', '.join(user_info['preferred_location'])}\n"
                    f"Top 3 Things for Future: {', '.join(user_info['top_3_things_for_future'])}\n"
                    f"Nationality: {user_info['nationality']}\n"
                    f"Job Title: {job_title}\n"
                    f"Onet Job Code: {job_code}\n"
                    f"Provide a strict list of 5 courses degree relevant to the student's education level and this job code. Only output an list having the course names based on the student profile, age, qualification, country. "
                )

                completion = client_openai.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are a course advisor."},
                        {"role": "user", "content": prompt}
                    ]
                )
                course_list = completion.choices[0].message.content.strip()
                interest_profiles.update_one(
                        {"userId": ObjectId(user_id), "careers.career.code": job_code},
                        {
                            "$set": {
                                f"careers.career.$[career].courses": course_list
                            }
                        },
                        array_filters=[{"career.code": job_code}]
                    )

        print("Course recommendations have been stored in the database.")

        return None
    else:
        print("No careers found for the user in the interest profile.")
        return None

# Example usage
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 your_script.py <user_id>")
        sys.exit(1)

    user_id = sys.argv[1]
    client = connect_to_mongo()

    if client:
        summarize_student(client, user_id)
        client.close()
