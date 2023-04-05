import requests

def task(command):

    api_endpoint = "https://api.openai.com/v1/completions"
    api_key = "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"
        
    request_headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + api_key
    }

    request_data = {
    "model": "text-davinci-003",
    "prompt": f"{command}. in one sentence",
    "max_tokens": 100,
    "temperature": 0.8
    }

    response = requests.post(api_endpoint, headers=request_headers, json=request_data)

    if response.status_code == 200:
        response_text = response.json()["choices"][0]["text"]
        print(response_text)

    else:
        print("Something went wrong")
    
    return command

if __name__ == "__main__":

    print("Hi, how can I help you?")

    while True:
        command = input("")
        print(command)
        if "how are you" in command:
            print("good")

        elif "what can you do" in command:
            print("I can answer your question based on data i have")

        elif "what is your name" in command:
            print("I am doc")

        elif 'medicine' in command:
            task(command)

        elif 'pain' in command:
            task(command)

        elif 'symptoms' in command:
            task(command)

        elif 'ache' in command:
            task(command)

        elif 'Wellness' in command:
            task(command)

        elif 'Disease' in command:
            task(command)

        elif 'Diagnosis' in command:
            task(command)

        else:
            print("Sorry, I am not aware of this.")