class AskGemini {
    constructor() {
        this.isGenerating = 'no'; // Variable to indicate if a prompt is currently being generated
    }

    getInfo() {
        return {
            id: "AskGemini",
            name: "Ask Gemini",
            color1: "#FFFFFF", // Light color for the block background
            color2: "#F0F0F0", // Slightly darker shade to maintain readability
            color3: "#E0E0E0", // Even darker for borders or outlines
            blocks: [
                {
                    opcode: "getPrompt",
                    blockType: "reporter",
                    text: "ask Gemini model [MODEL] for [PROMPT] with API key [API_KEY]",
                    arguments: {
                        MODEL: {
                            type: "string",
                            menu: "modelMenu",
                            defaultValue: "gemini-1.5-flash"
                        },
                        PROMPT: {
                            type: "string",
                            defaultValue: "Write a story about a magic backpack."
                        },
                        API_KEY: {
                            type: "string",
                            defaultValue: "" // Default to empty; user must provide it
                        }
                    }
                },
                {
                    opcode: "isGenerating",
                    blockType: "reporter",
                    text: "is generating prompt?",
                    arguments: {}
                }
            ],
            menus: {
                modelMenu: [
                    { value: "gemini-1.5-flash-8b", text: "gemini-1.5-flash-8b" },
                    { value: "gemini-1.5-flash", text: "gemini-1.5-flash" },
                    { value: "gemini-1.5-pro", text: "gemini-1.5-pro" },
                    { value: "gemini-1.0-pro", text: "gemini-1.0-pro" }
                ]
            }
        };
    }

    getPrompt({ MODEL, PROMPT, API_KEY }) {
        this.isGenerating = 'yes'; // Set generating status to yes
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

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
            const promptText = data.candidates[0].content.parts[0].text.replace(/\\n/g, '\n'); // Replace escaped newlines
            this.isGenerating = 'no'; // Set generating status back to no
            return promptText; // Return the generated prompt text
        })
        .catch(error => {
            console.error('Error fetching prompt:', error);
            this.isGenerating = 'no'; // Ensure generating status is set back to no in case of error
            return 'Error fetching prompt.'; // Return an error message
        });
    }

    isGenerating() {
        return this.isGenerating; // Returns the current generating status
    }
}

// Register the extension with Scratch
Scratch.extensions.register(new AskGemini());
