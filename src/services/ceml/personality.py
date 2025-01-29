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
print("OpenAI API Key:", openai_api_key)

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
    """
    Fetch DISC scores for a given user ID from the 'discprofiles' collection.

    Args:
        client: MongoDB client object.
        user_id: User ID as a string.

    Returns:
        A dictionary containing DISC scores or an empty dictionary if not found.
    """
    try:
        db = client['test2careerexplorer']
        disc_collection = db['discprofiles']

        # Fetch the DISC score document for the given user ID
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
    interest_profiles_collection = db['interestprofiles']  # Collection for RAISEC data

    # Fetch user document
    user_doc = interest_profiles_collection.find_one({"userId": ObjectId(user_id)})

    if not user_doc:
        print(f"No document found for userId: {user_id}")
        return None

    # Extract RAISEC results
    raisec_results = {
        "areas": []
    }

    # Process interest areas (results)
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

    # Fetch first_name and last_name from 'users' collection
    users_collection = db['users']
    user_details = users_collection.find_one({"_id": ObjectId(user_id)})

    first_name = user_details.get('firstName', 'User') if user_details else 'User'
    last_name = user_details.get('lastName', '') if user_details else ''
    gender = user_details.get('gender', '') if user_details else ''

    # Fetch additional information from 'surveys' collection
    surveys_collection = db['surveys']
    survey_details = surveys_collection.find_one({"userId": ObjectId(user_id)})

    intrest_collection = db['interestprofiles']
    # Fetch the user's interest profile from the collection
    intrest_details = intrest_collection.find_one({"userId": ObjectId(user_id)})

    # Extract careers with 'fit' as 'Best'
    if intrest_details and 'careers' in intrest_details:
        careers = intrest_details['careers'].get('career', [])
        perfect_fit_titles = [career['title'] for career in careers if career.get('fit') == "Perfect"]
    print(perfect_fit_titles)

    # Fetch DISC scores
    disc_score = fetch_disc_scores(client, user_id)

    # Fetch RAISEC results
    raisec_results = fetch_raisec_results(client,user_id)

    if survey_details:
        # Extracting relevant fields from survey information
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
            'gender':gender,
            'education_level': education_level,
            'grade_points': grade_points,
            'next_career_step': next_career_step,
            'most_appealing_field': most_appealing_field,
            'preferred_location': preferred_location,
            'top_3_things_for_future': top_3_things_for_future,
            'nationality': nationality,
            'selected_pathways': selected_pathways,
            'disc_score': disc_score,
            'raisec_results': raisec_results,
            'perfect_fit_job' : perfect_fit_titles
        }
    else:
        print(f"No survey data found for user ID: {user_id}")
        return None
    

def saveIntoDB(client, user_id, summary, fieldName):
    try:
        # Convert user_id to ObjectId if needed
        if not isinstance(user_id, ObjectId):
            user_id = ObjectId(user_id)
        
        db = client['test2careerexplorer']
        report_data_collection = db["reportData"]

        # Update or insert document
        result = report_data_collection.update_one(
            {"userId": user_id},
            {"$set": {fieldName: summary}},
            upsert=True
        )

      
    except Exception as e:
        print(f"Error saving summary into DB: {e}")

def summarize_student(client, user_id):

        # Fetch user information
        user_info = fetch_user_info(client, user_id)

        if user_info:
            # Extract DISC and RAISEC details
            disc_score = user_info['disc_score']
            raisec_results = user_info['raisec_results']

            most_scores = disc_score.get('most', {})
            least_scores = disc_score.get('least', {})
            difference_scores = disc_score.get('difference', {})

            areas_of_interest = raisec_results.get('areas', [])


            # Prepare prompt
            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
            f"Use the following information as context but do not repeat it directly in the analysis:\n"
            f"The student has the following details:\n"
            f"Name: {user_info['first_name']} {user_info['last_name']}\n"
            f"Gender: {user_info['gender']}Only for use of he or she insteed of this and they, do not print gender in output. \n"
            f"Education Level: {user_info['education_level']}\n"
            f"Grade Points: {user_info['grade_points']}\n"
            f"Next Career Step: {user_info['next_career_step']}\n"
            f"Most Appealing Field: {', '.join(user_info['most_appealing_field'])}\n"
            f"Preferred Location: {', '.join(user_info['preferred_location'])}\n"
            f"Nationality: {user_info['nationality']}\n"
            f"Perfect fit career role according to analysis: {', '.join(user_info['perfect_fit_job'])}\n"
            f"Based on this data, write a detailed 500-word summary of the student's personality and interests, "
            f"use both the survey data and information.The report should be more affirmative and coming with authority on the personality of the student. "
            f"Do not repeat the provided information verbatim. Provide insights based on the following context:\n"
            f"Use simple, clear language that children with basic English skills can easily understand.\n"
            f"DISC Scores:\n"
            f"  Most: {most_scores}\n"
            f"  Least: {least_scores}\n"
            f"  Difference: {difference_scores}\n"
            f"RAISEC Areas of Interest: {areas_of_interest}\n"
            f"Don't mention the DISC score scorecard or RAISEC score score into output.\n"
            )
            #perfecct fit fit.

            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a career advisor report generator."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            

            # Display the summary
            fieldName="personality_insight"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)

            # Fetch user information
        user_info = fetch_user_info(client, user_id)

        if user_info:
            # Extract DISC and RAISEC details
            disc_score = user_info['disc_score']
            raisec_results = user_info['raisec_results']

            most_scores = disc_score.get('most', {})
            least_scores = disc_score.get('least', {})
            difference_scores = disc_score.get('difference', {})

            areas_of_interest = raisec_results.get('areas', [])


            
            


                        # Prepare prompt
            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Based on this data, write a detailed 100-word analysis of the student's basic character traits, "
                f"providing insights drawn from the provided data. The analysis should avoid repeating the details verbatim but instead infer qualities like their decision-making style, "
                f"approach to challenges, adaptability, and values. Make the tone confident and assertive, "
                f"highlighting clear observations based on the following additional context:\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
                
            )
            #print(prompt)

            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="basic_character"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)


            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Based on this data, write a concise 100-word analysis of the student's acceptance of management responsibility. "
                f"Assess how willing the student is to take on managerial roles, their comfort with overseeing projects or teams, and their ability to make decisions that impact others. "
                f"Discuss their level of confidence when entrusted with leadership duties, how {user_info['first_name']} handle the pressure of responsibility, and their proactive or reactive approach to managing tasks. "
                f"Evaluate whether {user_info['first_name']} are likely to delegate tasks effectively, take ownership of outcomes, and maintain accountability for team performance. "
                f"Provide insights into their communication, organizational, and decision-making skills in the context of management responsibility. "
                f"Avoid repeating the provided information verbatim and draw conclusions based on the following additional context:\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )


            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="Acceptance_of_Management_responsibility"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)



            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} {user_info['last_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Based on this data, write a concise 100-word analysis of the factors that may demotivate . "
                f"Focus on potential triggers such as lack of recognition, unmet expectations, or challenges in personal or professional growth. "
                f"Use the DISC scores to assess how their personality traits and preferences might influence their motivation. "
                f"Explore how external pressures, challenges with authority, or difficult social dynamics may contribute to a decrease in motivation. "
                f"Identify work situations or environments that may demotivate." 
                f"Do not repeat the provided information verbatim; synthesize it to offer insights into what could potentially demotivate {user_info['first_name']} and hinder their progress.\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )



            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="Factors_that_may_demotivate"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)


            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Based on this data, write a concise 100-word analysis of the factors that could threaten the student's self-esteem. "
                f"Focus on potential triggers such as academic pressures, professional setbacks, or social challenges. "
                f"Use the DISC scores to explore how their personality traits may influence their vulnerabilities to self-doubt, criticism, or failure. "
                f"Assess how their expectations, response to authority, and interpersonal dynamics could affect their confidence in both personal and professional settings. "
                f"Do not repeat the provided information verbatim; synthesize it to offer insights into what factors might challenge the student's self-esteem and sense of self-worth.\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )




            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="Factors_that_threaten_self_esteem"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)

            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Based on this data, write a concise 100-word analysis of how the student {user_info['first_name']} relates to people, both professionally and socially. "
                f"Focus on their interpersonal skills, communication style, and ability to work within a team. "
                f"Use the DISC scores to gain insights into their tendencies in social and professional interactions. "
                f"Assess how {user_info['first_name']} might approach collaboration, leadership, and conflict resolution. "
                f"Do not repeat the provided information verbatim, but synthesize it to offer a clear view of how the student {user_info['first_name']} is likely to engage with others in various environments.\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )





            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="How_relates_to_people"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)



            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Based on this data, write a concise 100-word analysis of the student's capability for organization and planning. "
                f"Discuss their ability to set goals, prioritize tasks, and manage time effectively. "
                f"Highlight traits such as attention to detail, strategic thinking, or adaptability in handling unforeseen challenges. "
                f"Provide insights into how {user_info['first_name']} may approach both short-term and long-term planning. Avoid repeating the provided information verbatim and draw conclusions based on the following additional context:\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )





            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="capability_for_organization_and_planning"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)




            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Based on this data, write a concise 100-word analysis of the student's decision-making style. "
                f"Explore whether {user_info['first_name']} are analytical, intuitive, collaborative, or decisive in their approach. "
                f"Discuss their ability to weigh options, consider risks, and adapt to changing circumstances when making choices. "
                f"Highlight their ability to make speedy, well thought out and rationale decisions."
                f"Highlight how {user_info['first_name']} handle high-pressure situations or uncertainty. "
                f"Provide insights into their confidence level, openness to feedback, and reliance on logic, creativity, or emotion. "
                f"Avoid repeating the provided information verbatim and draw conclusions based on the following additional context:\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )





            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="decision_making"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)

            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Based on this data, write a concise 100-word analysis of the student's learning style. "
                f"Identify whether {user_info['first_name']} thrive in structured environments, hands-on experiences, visual or verbal instructions, collaborative settings, or independent study. "
                f"Highlight how {user_info['first_name']} process information and what methods are likely to enhance their learning efficiency and retention. "
                f"Avoid repeating the provided information verbatim and draw insightful conclusions based on the following additional context:\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )





            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="learning_style"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)



            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} {user_info['last_name']}\n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output.\n"
                f"Based on this data, write a concise 100-word analysis of the student's management technique. "
                f"Explore how {user_info['first_name']} handle responsibilities, coordinate tasks, and manage resources effectively. "
                f"Highlight traits like delegation skills, ability to motivate others, problem-solving capabilities, or preference for hands-on or strategic approaches. "
                f"Provide insights into their leadership style and adaptability in different situations. Avoid repeating the provided information verbatim and draw conclusions based on the following additional context:\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )





            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="management_technique"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)




            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Based on this data, write a detailed 100-word analysis of the student's motivational factors. "
                f"Identify the core drivers that inspire their actions, decisions, and long-term goals. Provide insights into what fuels their ambition, "
                f"how {user_info['first_name']} respond to challenges, and what environments or circumstances are likely to enhance their motivation. "
                f"Avoid repeating the provided information verbatim, and draw clear inferences based on the following additional context:\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )





            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="motivational_factors"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)



            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Based on this data, write a concise 100-word analysis of the student's potential as a team leader. "
                f"Focus on their ability to inspire, motivate, and manage a team effectively. "
                f"Use the DISC scores to evaluate their leadership traits, communication style, and approach to problem-solving. "
                f"Assess how their interpersonal skills, decision-making abilities, and reaction to authority may influence their effectiveness in a leadership role. "
                f"Consider how {user_info['first_name']} handle conflict, collaboration, and feedback within a team. "
                f"Do not repeat the provided information verbatim; instead, synthesize the data to give a clear picture of their suitability and readiness for a team leader position.\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )






            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="potential_as_a_Team_Leader"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)



            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                    f"Use the following information as context but do not repeat it directly in the analysis:\n"
                    f"Name: {user_info['first_name']} \n"
                    f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output.\n"
                    f"Based on this data, write a concise 100-word analysis of the student's potential as a team member. "
                    f"Focus on their ability to collaborate, contribute effectively to group efforts, and support team goals. "
                    f"Use the DISC scores to assess their interpersonal skills, willingness to cooperate, and ability to take initiative within a team. "
                    f"Evaluate how {user_info['first_name']} respond to leadership, handle feedback, and maintain a positive, productive attitude in a team setting. "
                    f"Consider how {user_info['first_name']} manage their role within a team, including their adaptability, communication style, and approach to problem-solving. "
                    f"Do not repeat the provided information verbatim; instead, synthesize the data to provide insights into their potential as a valuable and cooperative team member.\n"
                    f"Use simple, clear language that children with basic English skills can easily understand.\n"
                    f"DISC Scores:\n"
                    f"  Most: {most_scores}\n"
                    f"  Least: {least_scores}\n"
                    f"  Difference: {difference_scores}\n"
                    f"Don't mention the DISC score scorecard  into output.\n"
                )







            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="potential_as_a_Team_Member"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)


            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                        f"Use the following information as context but do not repeat it directly in the analysis:\n"
                        f"Name: {user_info['first_name']} \n"
                        f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                        f"Based on this data, write a concise 100-word analysis of the student's potential strengths. "
                        f"Highlight specific abilities, skills, or traits that indicate areas where the student is likely to excel. "
                        f"Focus on qualities such as problem-solving, creativity, leadership, adaptability, or other relevant strengths. "
                        f"Do not repeat the provided information verbatim but draw insightful conclusions based on the following additional context:\n"
                        f"Use simple, clear language that children with basic English skills can easily understand.\n"
                        f"DISC Scores:\n"
                        f"  Most: {most_scores}\n"
                        f"  Least: {least_scores}\n"
                        f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
                    )



            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="potential_strengths"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)




            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Based on this data, write a concise 100-word analysis of the student's potential weaknesses. "
                f"Identify areas that may hinder their progress or present challenges in achieving their goals. "
                f"Focus on traits or tendencies such as overcommitment, difficulty in adapting to change, procrastination, or lack of focus. "
                f"Avoid repeating the provided information verbatim and provide insights based on the following additional context:\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )




            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="potential_weaknesses"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)



            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Using this data, write a 100-word description of the student's questioning method, approach to asking questions to better understand the problem that needs to be solved . "
                f"Explain how {user_info['first_name']} approach asking questions, their preferred style of inquiry, "
                f"and how their DISC profile shape their ability to explore ideas and overcome objections and obstacles whilst questioning, solve problems, or seek clarity."
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )




            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="questioning_method"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)


            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                    f"Use the following information as context but do not repeat it directly in the analysis:\n"
                    f"The response to the sales environment has the following details:\n"
                    f"Name: {user_info['first_name']} \n"
                    f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                    f"Based on this data, write a concise 100-word analysis of the {user_info['first_name']} potential and fit for a sales environment. "
                    f"Focus on their communication style, decision-making abilities, and career aspirations in sales. "
                    f"Identify the work environments in which the student will be most successful in presenting opportunities and then for closing a sale."
                    f"Assess their readiness to adapt to a fast-paced, customer-facing role, highlighting their preferred work conditions, field interests, and future career goals. "
                    f"Use the DISC scores to further explore how their personality traits and interests can align with the sales environment. "
                    f"Do not repeat the provided information verbatim; synthesize it into a clear evaluation of how well the individual might thrive in a sales career.\n"
                    f"Use simple, clear language that children with basic English skills can easily understand.\n"
                    f"DISC Scores:\n"
                    f"  Most: {most_scores}\n"
                    f"  Least: {least_scores}\n"
                    f"  Difference: {difference_scores}\n"
                    f"Don't mention the DISC score scorecard  into output.\n"
                )





            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="response_to_a_sales_environment"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)


            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"The response to the technical environment has the following details:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output.\n"
                f"Based on this data, write a concise 100-word analysis of the student’s willingness and ability to resolve technical issues that need to be dealt with in a systematic and methodical manner. "
                f"Focus on their technical abilities, preferred working conditions, and career aspirations in the tech field. "
                f"Use the provided data to assess how well {user_info['first_name']} might adapt to technical roles, including their field interests, location preferences, and next career step. "
                f"Provide insights FROM the individual's DISC scores on the students likely performance in a technical work environment. "
                f"Do not repeat the information verbatim; synthesize it to give a clear overview of their fit for technical roles.\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )






            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="response_to_a_technical_environment"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)


            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Based on this data, write a concise 100-word analysis of the {user_info['first_name']} response to authority in work situations."
                f"Provide insights on positive and negative stimuli that may affect the student’s behavior in a highly autocratic work environment"
                f"Focus on how the student reacts to hierarchical structures, management styles, and authority figures in both educational and professional settings. "
                f"Use the DISC scores to assess {user_info['first_name']} openness to following instructions, receiving feedback, and working within a structured environment. "
                f"Consider how {user_info['first_name']} personality traits influence {user_info['first_name']} level of independence, respect for authority, and their approach to handling supervision. "
                f"Do not repeat the provided information verbatim; instead, synthesize it to provide a clear view of how the student is likely to respond to authority in various contexts.\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
            )







            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="response_to_authority"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)


            client_ai = OpenAI()  # Ensure correct OpenAI client initialization
            prompt = (
                f"Use the following information as context but do not repeat it directly in the analysis:\n"
                f"The student has the following details:\n"
                f"Name: {user_info['first_name']} \n"
                f"Gender: {user_info['gender']} Only for use of he or she . Generate text without 'this,' 'they', do not print gender in output. \n"
                f"Describe how their DISC profile, interests, and personality traits influence their approach to managing time, prioritizing tasks, and balancing short-term versus long-term goals. "
                f"Explain whether {user_info['first_name']} tend to focus on immediate tasks and meeting deadlines set or plan strategically for the future and how {user_info['first_name']} handle time pressures , 100 words sentence."
                f"Do not repeat the provided information verbatim; instead, synthesize the data to provide insights into their potential as a valuable and cooperative team member.\n"
                f"Use simple, clear language that children with basic English skills can easily understand.\n"
                f"DISC Scores:\n"
                f"  Most: {most_scores}\n"
                f"  Least: {least_scores}\n"
                f"  Difference: {difference_scores}\n"
                f"Don't mention the DISC score scorecard  into output.\n"
               
            )








            # ChatGPT API call to get the summary
            completion = client_ai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert psychometrician specializing in the analysis of DISC Personality profiles. Your role is to guide high school and higher education students in understanding their personality traits to align them with suitable career pathways, maximizing their potential for career success."},
                    {"role": "user", "content": prompt}
                ]
            )

            # Extract summary from the response
            summary = completion.choices[0].message.content.strip()

            # Display the summary
            fieldName="time_scale"
            # Save the summary into the database
            saveIntoDB(client, user_id, summary,fieldName)





        else:
            print("Unable to summarize due to missing user information.")



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
