class AskGemini {
    constructor() {}

    getInfo() {
        return {
            id: "AskGemini",
            name: "Ask Gemini",
            blocks: [
                {
                    opcode: "getStory",
                    blockType: "reporter",
                    text: "ask Gemini for [PROMPT] with API key [API_KEY]",
                    arguments: {
                        PROMPT: {
                            type: "string",
                            defaultValue: "Write a story about a magic backpack."
                        },
                        API_KEY: {
                            type: "string",
                            defaultValue: ""  // Default to empty; user must provide it
                        }
                    }
                }
            ]
        };
    }

    getStory({ PROMPT, API_KEY }) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: PROMPT }]
                }]
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Extract the story text
            const storyText = data.candidates[0].content.parts[0].text.replace(/\\n/g, '\n'); // Replace escaped newlines
            return storyText;
        })
        .catch(error => {
            console.error('Error fetching story:', error);
            return 'Error fetching story.';  // Return an error message
        });
    }
}

// Register the extension with Scratch
Scratch.extensions.register(new AskGemini());
