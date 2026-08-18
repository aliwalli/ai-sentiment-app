document.addEventListener("DOMContentLoaded", () => {
    const analyzeBtn = document.getElementById("analyze-btn");
    const textInput = document.getElementById("text-input");
    const resultCard = document.getElementById("result-card");
    const sentimentLabel = document.getElementById("sentiment-label");
    const confidenceScore = document.getElementById("confidence-score");
    const errorMsg = document.getElementById("error-msg");

    analyzeBtn.addEventListener("click", async () => {
        const text = textInput.value.trim();

        if (!text) {
            showError("Please enter some text first!");
            return;
        }

        errorMsg.classList.add("hidden");
        analyzeBtn.disabled = true;
        analyzeBtn.innerText = "Analyzing...";

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to analyze text.");
            }

            sentimentLabel.textContent = data.label;
            sentimentLabel.className = `badge ${data.label}`;
            confidenceScore.textContent = data.confidence;
            
            resultCard.classList.remove("hidden");
        } catch (err) {
            showError(err.message);
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.innerText = "Analyze Sentiment";
        }
    });

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove("hidden");
        resultCard.classList.add("hidden");
    }
});
