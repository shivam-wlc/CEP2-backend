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
        client = pymongo.MongoClient(mongo_uri)

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
        db = client['test3careerexplorer']
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

    db = client['test3careerexplorer']
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
def fetch_user_info(client, user_id,currentAttempt):
    db = client['test3careerexplorer']

    users_collection = db['users']
    user_details = users_collection.find_one({"_id": ObjectId(user_id)})

    first_name = user_details.get('firstName', 'User') if user_details else 'User'
    last_name = user_details.get('lastName', '') if user_details else ''

    surveys_collection = db['surveys']
    survey_details = surveys_collection.find_one({"userId": ObjectId(user_id), "attemptNumber": currentAttempt})

   # disc_score = fetch_disc_scores(client, user_id)

   # raisec_results = fetch_raisec_results(client, user_id)

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
            'selected_pathways': selected_pathways
           # 'disc_score': disc_score,
           # 'raisec_results': raisec_results
        }
    else:
        print(f"No survey data found for user ID: {user_id}")
        return None

# Function to summarize student personality and interests
def summarize_student(client, user_id,currentAttempt):
    user_info = fetch_user_info(client, user_id, currentAttempt)
    db = client['test3careerexplorer']
    interest_profiles = db['interestprofiles']
    interest_profile = interest_profiles.find_one({"userId": ObjectId(user_id),"attemptNumber": currentAttempt })

    if interest_profile and 'careers' in interest_profile:
        top_20_jobs = interest_profile['careers']['career'][:20]

        for job in top_20_jobs:
            job_code = job.get('code')
            job_title = job.get('title')

            if user_info:
                client_openai = OpenAI()
                for location in user_info.get('preferred_location', []):
                    prompt = (
                            f"The student has the following details:\n"
                            f"Name: {user_info['first_name']} {user_info['last_name']}\n"
                            f"Education Level: {user_info['education_level']}\n"
                            f"Grade Points: {user_info['grade_points']}\n"
                            f"Next Career Step: {user_info['next_career_step']}\n"
                            f"Most Appealing Field: {', '.join(user_info['most_appealing_field'])}\n"
                            f"Preferred Location: {location}\n"
                            f"Nationality: {user_info['nationality']}\n"
                            f"Job Title: {job_title}\n"
                            f"Onet Job Code: {job_code}\n"
                            f"Provide exactly 5 universities suitable for the student\'s education level, grade points, and career aspirations in the preferred location. "
                            f"Output the result strictly in the following format:\n"
                            f"1. <Name of the university> - <Official URL of the university>\n"
                            f"2. <Name of the university> - <Official URL of the university>\n"
                            f"3. <Name of the university> - <Official URL of the university>\n"
                            f"4. <Name of the university> - <Official URL of the university>\n"
                            f"5. <Name of the university> - <Official URL of the university>\n"
                            f"Do not include any additional text, explanations, numbering 1,2,3,4,5 or comments. Only return the list of universities in the specified format."
                        )

                    completion = client_openai.chat.completions.create(
                        model="gpt-4o-mini",
                        messages=[
                            {"role": "system", "content": "You are a university admission advisor."},
                            {"role": "user", "content": prompt}
                        ]
                    )

                    university_data = completion.choices[0].message.content.strip()

                    print(university_data)

                    # Update the MongoDB document
                    interest_profiles.update_one(
                        {"userId": ObjectId(user_id), "careers.career.code": job_code},
                        {
                            "$set": {
                                f"careers.career.$[career].universities.{location}": university_data
                            }
                        },
                        array_filters=[{"career.code": job_code}]
                    )

        print("University recommendations with links have been stored in the database.")

        return None
    else:
        print("No careers found for the user in the interest profile.")
        return None

# Example usage
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 your_script.py <user_id>")
        sys.exit(1)

    user_id = sys.argv[1]
    current_attempt = int(sys.argv[2]) 
    client = connect_to_mongo()

    if client:
        summarize_student(client, user_id,current_attempt)
        client.close()