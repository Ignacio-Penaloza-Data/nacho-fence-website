document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // ELEMENTS
    // ========================================

    const chatbotToggle =
        document.getElementById("chatbotToggle");

    const chatbotWindow =
        document.getElementById("chatbotWindow");

    const chatbotClose =
        document.getElementById("chatbotClose");

    const chatbotForm =
        document.getElementById("chatbotForm");

    const chatbotInput =
        document.getElementById("chatbotInput");

    const chatbotMessages =
        document.getElementById("chatbotMessages");

    const suggestionButtons =
        document.querySelectorAll(".chat-suggestion");


    // ========================================
    // OPEN / CLOSE CHAT
    // ========================================

    if (chatbotToggle && chatbotWindow) {

        chatbotToggle.addEventListener(
            "click",
            function () {

                chatbotWindow.classList.toggle("open");

                if (
                    chatbotWindow.classList.contains("open") &&
                    chatbotInput
                ) {
                    chatbotInput.focus();
                }

            }
        );

    }


    if (chatbotClose && chatbotWindow) {

        chatbotClose.addEventListener(
            "click",
            function () {

                chatbotWindow.classList.remove("open");

            }
        );

    }


    // ========================================
    // ADD MESSAGE
    // ========================================

    function addMessage(message, sender) {

        const messageContainer =
            document.createElement("div");


        messageContainer.classList.add(
            "chat-message",
            sender === "user"
                ? "user-message"
                : "bot-message"
        );


        // Add AI avatar only for bot messages
        if (sender === "bot") {

            const avatar =
                document.createElement("div");

            avatar.classList.add("message-avatar");

            avatar.textContent = "AI";

            messageContainer.appendChild(avatar);

        }


        const messageBubble =
            document.createElement("div");

        messageBubble.classList.add("message-bubble");

        messageBubble.textContent = message;


        messageContainer.appendChild(messageBubble);

        chatbotMessages.appendChild(messageContainer);


        scrollToBottom();

    }


    // ========================================
    // SCROLL TO BOTTOM
    // ========================================

    function scrollToBottom() {

        chatbotMessages.scrollTop =
            chatbotMessages.scrollHeight;

    }


    // ========================================
    // TYPING INDICATOR
    // ========================================

    function showTypingIndicator() {

        const typingContainer =
            document.createElement("div");

        typingContainer.classList.add(
            "chat-message",
            "bot-message"
        );

        typingContainer.id = "typingIndicator";


        const avatar =
            document.createElement("div");

        avatar.classList.add("message-avatar");

        avatar.textContent = "AI";


        const bubble =
            document.createElement("div");

        bubble.classList.add("message-bubble");


        const indicator =
            document.createElement("div");

        indicator.classList.add("typing-indicator");


        indicator.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;


        bubble.appendChild(indicator);

        typingContainer.appendChild(avatar);

        typingContainer.appendChild(bubble);

        chatbotMessages.appendChild(typingContainer);


        scrollToBottom();

    }


    function removeTypingIndicator() {

        const typingIndicator =
            document.getElementById("typingIndicator");


        if (typingIndicator) {
            typingIndicator.remove();
        }

    }


    // ========================================
    // SEND MESSAGE TO AI BACKEND
    // ========================================

    async function sendMessage(message) {

        const trimmedMessage =
            message.trim();


        if (!trimmedMessage) {
            return;
        }


        // Show user message
        addMessage(
            trimmedMessage,
            "user"
        );


        chatbotInput.value = "";


        // Show typing animation
        showTypingIndicator();


        // Prevent duplicate submissions
        chatbotInput.disabled = true;


        try {

            const response = await fetch(
                "https://nacho-fence-ai-api.vercel.app/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        message: trimmedMessage
                    })
                }
            );


            const data =
                await response.json();


            removeTypingIndicator();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Something went wrong."
                );

            }


            // Show actual AI response
            addMessage(
                data.reply,
                "bot"
            );


        } catch (error) {

            removeTypingIndicator();


            console.error(
                "Chatbot error:",
                error
            );


            addMessage(
                "Sorry, the AI assistant is temporarily unavailable. Please try again shortly.",
                "bot"
            );

        } finally {

            chatbotInput.disabled = false;

            chatbotInput.focus();

        }

    }


    // ========================================
    // FORM SUBMIT
    // ========================================

    if (chatbotForm) {

        chatbotForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                sendMessage(
                    chatbotInput.value
                );

            }
        );

    }


    // ========================================
    // SUGGESTED QUESTIONS
    // ========================================

    suggestionButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    sendMessage(
                        button.textContent
                    );

                }
            );

        }
    );

});