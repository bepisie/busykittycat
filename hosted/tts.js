/* Scratch Extension using the JavaScript Speech API for text to speech */

(function() {
    var ext = this;
    var synth = window.speechSynthesis;
    var voices = [];
    var selectedVoice = null;
    var speakRate = 1; // Default speaking rate

    // Function to load and set available voices
    function loadVoices() {
        voices = synth.getVoices();
        // Set a default voice if none is selected
        if (!selectedVoice && voices.length > 0) {
            selectedVoice = voices[0]; // Fallback to the first available voice
        }
    }

    // Load voices when available
    window.speechSynthesis.onvoiceschanged = function() {
        loadVoices();
    };

    // Function to speak the provided text
    ext.speak_text = function(text) {
        if (synth && text && selectedVoice) {
            synth.cancel(); // Stop any ongoing speech to reduce delay
            var utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice; // Set the chosen voice
            utterance.rate = speakRate; // Set speaking rate
            synth.speak(utterance);
        } else {
            console.warn("No text to speak or voice is not selected.");
        }
    };

    // Function to set the speaking rate
    ext.set_speak_rate = function(rate) {
        speakRate = Math.min(Math.max(rate, 0.1), 3); // Constrain rate between 0.1 and 3
    };

    // Function to set the voice type (male or female)
    ext.set_voice_type = function(type) {
        // Clear previous selection
        selectedVoice = null;

        // Find a suitable voice based on the selected type
        voices.forEach(voice => {
            if (type === "female" && voice.name.toLowerCase().includes("female")) {
                selectedVoice = voice;
            } else if (type === "male" && voice.name.toLowerCase().includes("male")) {
                selectedVoice = voice;
            }
        });

        // Log the selected voice for debugging
        if (selectedVoice) {
            console.log(`Selected Voice: ${selectedVoice.name}`);
        } else {
            console.warn("No suitable voice found.");
        }
    };

    // Extension shutdown (not used in this case)
    ext._shutdown = function() {};

    // Function to check the status of text-to-speech support
    ext._getStatus = function() {
        if (!synth) {
            return { status: 1, msg: 'Your browser does not support speech synthesis. Try using a modern browser.' };
        }
        return { status: 2, msg: 'Ready' };
    };

    // Descriptor for Scratch extension blocks
    var descriptor = {
        blocks: [
            [' ', 'speak %s', 'speak_text', 'Hello, world!'],
            [' ', 'set speaking rate to %n', 'set_speak_rate', 1],
            [' ', 'set voice type to %m.voiceType', 'set_voice_type', 'female']
        ],
        menus: {
            voiceType: ['male', 'female']
        },
        color: '#FFFFFF' // Set block color to white
    };

    // Register the Scratch extension
    ScratchExtensions.register('Text To Speech with Male and Female Voices', descriptor, ext);
})();
