from enum import Enum

class FlashcardStatus(str, Enum):
    NEW = "NEW"
    LEARNING = "LEARNING"
    REVIEW = "REVIEW"
    RELEARNING = "RELEARNING"
    MASTERED = "MASTERED"
    REOPENED = "REOPENED"
    SUSPENDED = "SUSPENDED"
    HIDDEN = "HIDDEN"