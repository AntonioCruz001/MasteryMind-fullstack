from enum import Enum

# class FlashcardStatus(str, Enum):
#     NEW = "NEW"
#     LEARNING = "LEARNING"
#     REVIEW = "REVIEW"
#     RELEARNING = "RELEARNING"
#     MASTERED = "MASTERED"
#     REOPENED = "REOPENED"
#     SUSPENDED = "SUSPENDED"
#     HIDDEN = "HIDDEN"

class FlashcardStatus(str, Enum):
    NEW = "NEW"
    LEARNING = "LEARNING" # Lv 0 depois que já iniciou
    REVIEW_1 = "REVIEW_1"
    REVIEW_2 = "REVIEW_2"
    REVIEW_3 = "REVIEW_3"
    MASTERED = "MASTERED"
    SUSPENDED = "SUSPENDED"
    HIDDEN = "HIDDEN"