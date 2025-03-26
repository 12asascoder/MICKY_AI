document.addEventListener("DOMContentLoaded", function () {
    const talkButton = document.getElementById("talkButton");
    const responseText = document.getElementById("response");
    const circle = document.getElementById("circle");
    const leftEar = document.getElementById("leftEar");
    const rightEar = document.getElementById("rightEar");
    const waveform = document.getElementById("waveform");
    const uiContainer = document.getElementById("uiContainer");
    
    let micOn = false;
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    
    talkButton.addEventListener("click", () => {
        micOn = !micOn;
        if (micOn) {
            responseText.textContent = "Listening...";
            recognition.start();
            talkButton.innerText = "Stop Micky";
            circle.classList.add("active");
            leftEar.classList.add("active");
            rightEar.classList.add("active");
            waveform.classList.add("active");
            uiContainer.classList.add("ai-active");
        } else {
            recognition.stop();
            responseText.textContent = "";
            talkButton.innerText = "Talk to Micky";
            circle.classList.remove("active");
            leftEar.classList.remove("active");
            rightEar.classList.remove("active");
            waveform.classList.remove("active");
            uiContainer.classList.remove("ai-active");
        }
    });

    recognition.onresult = (event) => {
        const userSpeech = event.results[0][0].transcript;
        responseText.textContent = "";
        typeText(responseText, `You said: ${userSpeech}`);
        sendToMicky(userSpeech);
    };
    
    recognition.onerror = (event) => {
        responseText.textContent = "Error: Try again.";
    };
    
    async function sendToMicky(text) {
        const response = await fetch("/micky", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: text })
        });
        const data = await response.json();
        responseText.textContent = "";
        typeText(responseText, data.response);
        speakResponse(data.response);
    }
    
    function speakResponse(text) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        window.speechSynthesis.speak(speech);
    }
    
    function typeText(element, text) {
        let index = 0;
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 50);
            }
        }
        type();
    }
});
