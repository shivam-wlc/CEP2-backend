from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import pymongo
import sys
from bson import ObjectId
import numpy as np
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
    except ConnectionFailure as e:
        print(f"MongoDB connection failed: {e}")
        return None

# Load DISC scores from CSV
def load_disc_scores(csv_filepath):
    df = pd.read_csv(csv_filepath)
    disc_scores = {}
    for _, row in df.iterrows():
        disc_scores[row['O*NET-SOC Code']] = {
            'Title': row['Title'],
            'Dominance': row['Domininance'],
            'Influence': row['Inflluence'],
            'Steadiness': row['Steadiness'],
            'Conscientiousness': row['Conscientiousness']
        }
    return disc_scores



# Define DISC range functions
def get_dominance_category(difference_value):
    if 20 >= difference_value >= 15:
        return "Very High"
    elif 15 > difference_value >= 7:
        return "High"
    elif 7 > difference_value >= 1:
        return "Medium (Above line)"
    elif 1 > difference_value >= -3:
        return "Medium (Below line)"
    elif -3 > difference_value >= -13.5:
        return "Low"
    elif -13.5 > difference_value >= -21:
        return "Very Low"
    else:
        return "Out of Range"

def get_influence_category(difference_value):
    if 17 >= difference_value >= 8:
        return "Very High"
    elif 8 > difference_value >= 2:
        return "High"
    elif 2 > difference_value >= 0.5:
        return "Medium (Above line)"
    elif 0.5 > difference_value >= -3:
        return "Medium (Below line)"
    elif -3 > difference_value >= -10:
        return "Low"
    elif -10 > difference_value >= -19:
        return "Very Low"
    else:
        return "Out of Range"

def get_steadiness_category(difference_value):
    if 19 >= difference_value >= 10:
        return "Very High"
    elif 10 > difference_value >= 2:
        return "High"
    elif 2 > difference_value >= -1:
        return "Medium (Above line)"
    elif -1 > difference_value >= -4:
        return "Medium (Below line)"
    elif -4 > difference_value >= -11.5:
        return "Low"
    elif -11.5 > difference_value >= -19:
        return "Very Low"
    else:
        return "Out of Range"

def get_conscientiousness_category(difference_value):
    if 15 >= difference_value >= 6:
        return "Very High"
    elif 6 > difference_value >= 0:
        return "High"
    elif 0 > difference_value >= -2.5:
        return "Medium (Above line)"
    elif -2.5 > difference_value >= -5.5:
        return "Medium (Below line)"
    elif -5.5 > difference_value >= -12:
        return "Low"
    elif -12 > difference_value >= -16:
        return "Very Low"
    else:
        return "Out of Range"


# Enhanced DISC match using cosine similarity
def calculate_disc_match(student_diff, job_disc):
    student_vector = disc_to_vector(student_diff)
    job_vector = disc_to_vector(job_disc)

    # Compute cosine similarity between student and job vectors
    similarity = cosine_similarity(student_vector, job_vector)[0][0]
    
    return similarity

# Mapping for converting DISC categories to numeric values
category_to_numeric = {
    "Very High": 2,
    "High": 1,
    "Medium (Above line)": 0.5,
    "Medium (Below line)": -0.5,
    "Low": -1,
    "Very Low": -2,
    "Out of Range": 0  # Use 0 for out-of-range values or missing categories
}

# Convert categorized DISC profiles (both student and job) to numeric vectors
def disc_to_vector(dominance, influence, steadiness, conscientiousness):
    return np.array([
        category_to_numeric.get(dominance, 0),
        category_to_numeric.get(influence, 0),
        category_to_numeric.get(steadiness, 0),
        category_to_numeric.get(conscientiousness, 0)
    ]).reshape(1, -1)


def calculate_disc_match(student_diff, job_disc):
    # Get categories for student DISC profile using difference values
    student_d_category = get_dominance_category(student_diff['D'])
    student_i_category = get_influence_category(student_diff['I'])
    student_s_category = get_steadiness_category(student_diff['S'])
    student_c_category = get_conscientiousness_category(student_diff['C'])

    # Get job DISC categories (already in categories from your CSV)
    job_d_category = job_disc['Dominance']
    job_i_category = job_disc['Influence']
    job_s_category = job_disc['Steadiness']
    job_c_category = job_disc['Conscientiousness']

    # Convert both student and job DISC categories to numeric vectors
    student_vector = disc_to_vector(student_d_category, student_i_category, student_s_category, student_c_category)
    job_vector = disc_to_vector(job_d_category, job_i_category, job_s_category, job_c_category)

    # Calculate cosine similarity between the two vectors
    similarity = cosine_similarity(student_vector, job_vector)[0][0]

    # Normalize similarity score to range [1, 5] and round to the nearest integer
    normalized_score = round(1 + 4 * ((similarity + 1) / 2))  # Convert similarity [-1, 1] to [1, 5]

    return normalized_score
# Fetch student DISC profile and match to best career

# Fetch student DISC profile and match to best career
def match_student_to_career(client, userId, currentAttempt, disc_scores):
    db = client['test3careerexplorer']  # Replace <dbname>
    disc_profiles = db['discprofiles']
    interest_profiles = db['interestprofiles']
   
    # Fetch student profile by student_id using ObjectId from bson
    # student_profile = disc_profiles.find_one({"userId": ObjectId(userId)})
     # Fetch student DISC profile with `currentAttempt`
    student_profile = disc_profiles.find_one({
        "userId": ObjectId(userId),
        "attemptNumber": currentAttempt  # Ensure you have an "attempt" field in MongoDB
    })
    
    if student_profile:
        user_id = student_profile['userId']  # Get the userId from the disc profile
        student_diff = student_profile['scores']['difference']
        
        # Print student DISC scores for debugging
        print(f"\nStudent DISC profile (difference): {student_diff}")

        # Fetch interest profiles for the same userId and limit it to 20 jobs
        interest_profile = interest_profiles.find_one({"userId": user_id, "attemptNumber": currentAttempt})

        if interest_profile and 'careers' in interest_profile:
            top_20_jobs = interest_profile['careers']['career'][:20]  # Extract top 20 jobs

            match_results = []

            # Loop through the top 20 jobs and find the best match
            for job in top_20_jobs:
                job_code = job.get('code')  # Fetch job code from the 'career' array in interestprofiles
                
                if job_code in disc_scores:
                    job_disc = disc_scores[job_code]

                    # Print DISC score for the job from CSV
                    # print(f"\nJob DISC profile for job code {job_code} ({job_disc['Title']}): {job_disc}")

                    # Calculate match score between student's DISC profile and job DISC profile
                    match_score = calculate_disc_match(student_diff, job_disc)
                    print(f"\n For job {job_code} : {match_score}")
                    # Store match results in a list
                    match_results.append({
                        'job_code': job_code,
                        'title': job_disc['Title'],
                        'match_score': match_score
                    })
                    collection = db["interestprofiles"] 
                    collection.update_one(
                                {"userId": user_id, "careers.career.code": job_code},  # Filter by user and career code
                                {
                                    "$set": {
                                        "careers.career.$[career].match_score": match_score  # Update match_score
                                    }
                                },
                                array_filters=[{"career.code": job_code}]
                            )
            # Sort match results by match score (descending)
            match_results.sort(key=lambda x: x['match_score'], reverse=True)

           
        else:
            print("No career data found for this user.")
    else:
        print(f"No student profile found for ID: {user_id}")

#  usage
if __name__ == "__main__":

    if len(sys.argv) != 3:
        print("Usage: python3 your_script.py <user_id>")
        sys.exit(1)

    user_id = sys.argv[1]
    current_attempt = int(sys.argv[2]) 
    # Load DISC scores from CSV
    # disc_scores = load_disc_scores('disc_scores.csv')
    csv_filepath = os.path.join(os.path.dirname(__file__), 'disc_scores.csv')
    disc_scores = load_disc_scores(csv_filepath)
    
    # Connect to MongoDB
    client = connect_to_mongo()

    if client:
        # Replace with actual student ID
        match_student_to_career(client, user_id,current_attempt, disc_scores)
        client.close()
