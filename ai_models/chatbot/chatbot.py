RESPONSES = {
    "delay": "Flight delays can be caused by weather, air traffic, or technical issues.",
    "price": "Ticket prices vary based on season, demand, and days before departure.",
    "cancel": "Cancellations are most common during severe weather or operational issues.",
    "baggage": "Standard baggage allowance is 23kg for checked and 7kg for cabin.",
    "default": "I'm SkyMind AI assistant. Ask me about flights, delays, prices, or cancellations.",
}

def get_response(message: str) -> str:
    msg = message.lower()
    for key in RESPONSES:
        if key in msg:
            return RESPONSES[key]
    return RESPONSES["default"]
