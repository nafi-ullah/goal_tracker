import openai
from pathlib import Path

openai.api_key = ""
output_file = Path("namaz_reminder.mp3")

# DELIVERY PROMPT (this controls tone, pacing, emotion)
delivery_prompt = (
    "Speak in a calm but firm male voice. "
    "Tone should be motivational, sincere, and slightly urgent, "
    "as if reminding someone you care about. "
    "Pause briefly after important sentences. "
    "Do not sound aggressive or robotic. "
    "Sound respectful, reflective, and spiritually grounded."
)

# SPOKEN CONTENT
text = (
    "Nafi, stop for a moment. "
    "You are busy with work—but who is sustaining you? "
    "It is not your job. It is Allah who gives rizq, health, and strength. "
    "Do not delay your prayer for what Allah already controls. "
    "Stand up. Make wudu. Pray now."
)

with openai.audio.speech.with_streaming_response.create(
    model="gpt-4o-mini-tts",
    voice="onyx",  # Deep male voice - other male options: 'echo', 'ash'
    input=f"{text}"
) as response:
    response.stream_to_file(output_file)

print("Motivational Namaz reminder generated:", output_file)
