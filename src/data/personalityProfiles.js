export const MBTI_PROFILES = {
    // ANALYSTS
    INTJ: {
        title: "The Mastermind",
        tagline: "Imaginative and strategic thinkers, with a plan for everything.",
        strengths: ["Strategic Thinking", "High Standards", "Independent", "Global Vision"],
        weaknesses: ["Overly Critical", "Dismissive of Emotions", "Perfectionist"],
        hobbies: ["Strategy Games", "Programming", "Philosophy", "Reading"],
        careers: [
            { role: "Software Architect", match: 98 },
            { role: "Surgeon", match: 96 },
            { role: "Investment Banker", match: 94 },
            { role: "Judge", match: 90 },
            { role: "Scientist", match: 95 }
        ],
        characters: [
            { name: "Walter White", source: "Breaking Bad" },
            { name: "Gandalf", source: "Lord of the Rings" },
            { name: "Bruce Wayne", source: "The Dark Knight" },
            { name: "Beth Harmon", source: "The Queen's Gambit" }
        ],
        movies: [
            { title: "Inception", genre: "Sci-Fi Thriller" },
            { title: "The Imitation Game", genre: "Biography" },
            { title: "Arrival", genre: "Sci-Fi" },
            { title: "Sherlock Holmes", genre: "Mystery" }
        ],
        quote: "I’m not arguing, I’m explaining why I’m right."
    },
    INTP: {
        title: "The Logician",
        tagline: "Innovative inventors with an unquenchable thirst for knowledge.",
        strengths: ["Analytical", "Original", "Open-Minded", "Objective"],
        weaknesses: ["Disconnected", "Insensitive", "Analysis Paralysis"],
        hobbies: ["Coding", "Video Games", "Debating", "Science Fiction"],
        careers: [
            { role: "Data Scientist", match: 99 },
            { role: "Professor", match: 95 },
            { role: "Systems Engineer", match: 94 },
            { role: "Mathematician", match: 98 },
            { role: "Philosopher", match: 90 }
        ],
        characters: [
            { name: "L (Lawliet)", source: "Death Note" },
            { name: "Spencer Reid", source: "Criminal Minds" },
            { name: "Neo", source: "The Matrix" },
            { name: "Rust Cohle", source: "True Detective" }
        ],
        movies: [
            { title: "The Matrix", genre: "Sci-Fi" },
            { title: "Ex Machina", genre: "Sci-Fi Thriller" },
            { title: "A Beautiful Mind", genre: "Biography" },
            { title: "Interstellar", genre: "Sci-Fi" }
        ],
        quote: "I am interested in the truth, not what people want to be true."
    },
    ENTJ: {
        title: "The Commander",
        tagline: "Bold, imaginative and strong-willed leaders, always finding a way - or making one.",
        strengths: ["Efficient", "Energetic", "Self-Confident", "Charismatic"],
        weaknesses: ["Stubborn", "Intolerant", "Arrogant"],
        hobbies: ["Public Speaking", "Investing", "Competitive Sports", "Reading"],
        careers: [
            { role: "CEO / Executive", match: 99 },
            { role: "Management Consultant", match: 96 },
            { role: "Lawyer", match: 95 },
            { role: "Judge", match: 92 },
            { role: "University Professor", match: 90 }
        ],
        characters: [
            { name: "Thomas Shelby", source: "Peaky Blinders" },
            { name: "Harvey Specter", source: "Suits" },
            { name: "Miranda Priestly", source: "Devil Wears Prada" },
            { name: "Tywin Lannister", source: "Game of Thrones" }
        ],
        movies: [
            { title: "The Wolf of Wall Street", genre: "Crime/Comedy" },
            { title: "Steve Jobs", genre: "Biography" },
            { title: "Patton", genre: "Biography" },
            { title: "Vice", genre: "Biography" }
        ],
        quote: "Efficiency is doing things right; effectiveness is doing the right things."
    },
    ENTP: {
        title: "The Debater",
        tagline: "Smart and curious thinkers who cannot resist an intellectual challenge.",
        strengths: ["Knowledgeable", "Quick-Thinker", "Original", "Charismatic"],
        weaknesses: ["Argumentative", "Insensitive", "Difficult to Focus"],
        hobbies: ["Debating", "Entrepreneurship", "Skydiving", "Improv"],
        careers: [
            { role: "Entrepreneur", match: 98 },
            { role: "Lawyer", match: 95 },
            { role: "Marketing Director", match: 92 },
            { role: "Politician", match: 90 },
            { role: "Creative Director", match: 94 }
        ],
        characters: [
            { name: "Tony Stark", source: "Iron Man" },
            { name: "Tyrion Lannister", source: "Game of Thrones" },
            { name: "The Joker", source: "Batman" },
            { name: "Jack Sparrow", source: "Pirates of the Caribbean" }
        ],
        movies: [
            { title: "Iron Man", genre: "Action" },
            { title: "Catch Me If You Can", genre: "Crime/Biography" },
            { title: "Fight Club", genre: "Drama" },
            { title: "Thank You for Smoking", genre: "Comedy" }
        ],
        quote: "I argue to learn, not just to win."
    },

    // DIPLOMATS
    INFJ: {
        title: "The Advocate",
        tagline: "Quiet and mystical, yet very inspiring and tireless idealists.",
        strengths: ["Creative", "Insightful", "Principled", "Passionate"],
        weaknesses: ["Sensitive to Criticism", "Perfectionist", "Private"],
        hobbies: ["Writing", "Art Appreciation", "Volunteering", "Gardening"],
        careers: [
            { role: "Psychologist", match: 98 },
            { role: "Writer / Author", match: 96 },
            { role: "Counselor", match: 95 },
            { role: "HR Manager", match: 90 },
            { role: "Non-Profit Founder", match: 92 }
        ],
        characters: [
            { name: "Albus Dumbledore", source: "Harry Potter" },
            { name: "Atticus Finch", source: "To Kill a Mockingbird" },
            { name: "Lisa Simpson", source: "The Simpsons" },
            { name: "Yoda", source: "Star Wars" }
        ],
        movies: [
            { title: "Amélie", genre: "Romance/Comedy" },
            { title: "Eternal Sunshine", genre: "Romance/Sci-Fi" },
            { title: "Her", genre: "Romance/Sci-Fi" },
            { title: "Schindler's List", genre: "History" }
        ],
        quote: "Treat people as if they were what they ought to be and you help them to become what they are capable of being."
    },
    INFP: {
        title: "The Mediator",
        tagline: "Poetic, kind and altruistic people, always eager to help a good cause.",
        strengths: ["Empathetic", "Generous", "Open-Minded", "Creative"],
        weaknesses: ["Unrealistic", "Self-Isolating", "Unfocused"],
        hobbies: ["Poetry", "Calligraphy", "Indie Music", "Photography"],
        careers: [
            { role: "Writer", match: 98 },
            { role: "Graphic Designer", match: 95 },
            { role: "Veterinarian", match: 92 },
            { role: "Therapist", match: 94 },
            { role: "Librarian", match: 90 }
        ],
        characters: [
            { name: "Frodo Baggins", source: "Lord of the Rings" },
            { name: "Luke Skywalker", source: "Star Wars" },
            { name: "Wanda Maximoff", source: "Marvel" },
            { name: "Amélie Poulain", source: "Amélie" }
        ],
        movies: [
            { title: "Midnight in Paris", genre: "Fantasy/Romance" },
            { title: "Into the Wild", genre: "Adventure/Biography" },
            { title: "Spirited Away", genre: "Animation" },
            { title: "Little Miss Sunshine", genre: "Comedy/Drama" }
        ],
        quote: "Not all those who wander are lost."
    },
    ENFJ: {
        title: "The Protagonist",
        tagline: "Charismatic and inspiring leaders, able to mesmerize their listeners.",
        strengths: ["Reliable", "Passion", "Altruistic", "Charismatic"],
        weaknesses: ["Overly Idealistic", "Too Sensitive", "Struggle to say No"],
        hobbies: ["Event Planning", "Blog Writing", "Cooking", "Team Sports"],
        careers: [
            { role: "Teacher", match: 98 },
            { role: "Public Relations", match: 96 },
            { role: "Sales Manager", match: 94 },
            { role: "Politician", match: 90 },
            { role: "Coach", match: 95 }
        ],
        characters: [
            { name: "Daenerys Targaryen", source: "Game of Thrones" },
            { name: "Morpheus", source: "The Matrix" },
            { name: "Captain America", source: "Marvel" },
            { name: "Wonder Woman", source: "DC Comics" }
        ],
        movies: [
            { title: "Dead Poets Society", genre: "Drama" },
            { title: "Remember the Titans", genre: "Drama/Sport" },
            { title: "Jerry Maguire", genre: "Drama/Comedy" },
            { title: "Wonder Woman", genre: "Action" }
        ],
        quote: "Real leadership is about making others better as a result of your presence."
    },
    ENFP: {
        title: "The Campaigner",
        tagline: "Enthusiastic, creative and sociable free spirits, who can always find a reason to smile.",
        strengths: ["Curious", "Observant", "Energetic", "Excellent Communicator"],
        weaknesses: ["Poor Practical Skills", "Find it Hard to Focus", "Overthinker"],
        hobbies: ["Traveling", "Acting", "Blogging", "Painting"],
        careers: [
            { role: "Journalist", match: 98 },
            { role: "Actor", match: 95 },
            { role: "Event Planner", match: 94 },
            { role: "Teacher", match: 92 },
            { role: "Consultant", match: 90 }
        ],
        characters: [
            { name: "Spider-Man (Peter Parker)", source: "Marvel" },
            { name: "Michael Scott", source: "The Office" },
            { name: "Rapunzel", source: "Tangled" },
            { name: "Eleven", source: "Stranger Things" }
        ],
        movies: [
            { title: "Everything Everywhere All At Once", genre: "Sci-Fi/Adventure" },
            { title: "La La Land", genre: "Musical" },
            { title: "Ferris Bueller's Day Off", genre: "Comedy" },
            { title: "School of Rock", genre: "Comedy" }
        ],
        quote: "Life is either a daring adventure or nothing at all."
    },

    // SENTINELS
    ISTJ: {
        title: "The Logistician",
        tagline: "Practical and fact-minded individuals, whose reliability cannot be doubted.",
        strengths: ["Honest", "Direct", "Strong Will", "Responsible"],
        weaknesses: ["Stubborn", "Judgey", "Always by the Book"],
        hobbies: ["DIY Projects", "Reading", "Hiking", "Genealogy"],
        careers: [
            { role: "Accountant", match: 99 },
            { role: "Military Officer", match: 96 },
            { role: "Judge", match: 94 },
            { role: "Police Officer", match: 92 },
            { role: "Data Analyst", match: 90 }
        ],
        characters: [
            { name: "Ned Stark", source: "Game of Thrones" },
            { name: "Hermione Granger", source: "Harry Potter" },
            { name: "Darth Vader", source: "Star Wars" },
            { name: "Inspector Javert", source: "Les Misérables" }
        ],
        movies: [
            { title: "Sully", genre: "Biography" },
            { title: "Moneyball", genre: "Biography/Drama" },
            { title: "Black Hawk Down", genre: "War" },
            { title: "Bridge of Spies", genre: "History" }
        ],
        quote: "Facts do not cease to exist because they are ignored."
    },
    ISFJ: {
        title: "The Defender",
        tagline: "Very dedicated and warm protectors, always ready to defend their loved ones.",
        strengths: ["Supportive", "Reliable", "Patient", "Imaginative"],
        weaknesses: ["Humble", "Taking Things Personally", "Repressing Feelings"],
        hobbies: ["Cooking", "Gardening", "Volunteering", "Watching Movies"],
        careers: [
            { role: "Nurse", match: 98 },
            { role: "Teacher", match: 96 },
            { role: "Social Worker", match: 94 },
            { role: "Bookkeeper", match: 92 },
            { role: "HR Specialist", match: 90 }
        ],
        characters: [
            { name: "Captain America (Steve Rogers)", source: "Marvel" },
            { name: "Samwise Gamgee", source: "Lord of the Rings" },
            { name: "Dr. Watson", source: "Sherlock Holmes" },
            { name: "Pam Beesly", source: "The Office" }
        ],
        movies: [
            { title: "The Blind Side", genre: "Biography" },
            { title: "Dances with Wolves", genre: "Adventure" },
            { title: "The King's Speech", genre: "History" },
            { title: "Forrest Gump", genre: "Drama" }
        ],
        quote: "Love only grows by sharing. You can only have more for yourself by giving it away to others."
    },
    ESTJ: {
        title: "The Executive",
        tagline: "Excellent administrators, unsurpassed at managing things - or people.",
        strengths: ["Dedicated", "Strong Willed", "Direct", "Organized"],
        weaknesses: ["Inflexible", "Uncomfortable with Emotion", "Judgmental"],
        hobbies: ["Organizing", "Coaching", "Golf", "Volunteering (Leadership)"],
        careers: [
            { role: "General Manager", match: 99 },
            { role: "Insurance Agent", match: 96 },
            { role: "Judge", match: 94 },
            { role: "Principal", match: 92 },
            { role: "Chef", match: 90 }
        ],
        characters: [
            { name: "Dwight Schrute", source: "The Office" },
            { name: "Princess Leia", source: "Star Wars" },
            { name: "Professor McGonagall", source: "Harry Potter" },
            { name: "Boromir", source: "Lord of the Rings" }
        ],
        movies: [
            { title: "The Founder", genre: "Biography" },
            { title: "Patton", genre: "War/Biography" },
            { title: "Whiplash", genre: "Drama" },
            { title: "A Few Good Men", genre: "Drama" }
        ],
        quote: "Good order is the foundation of all things."
    },
    ESFJ: {
        title: "The Consul",
        tagline: "Extraordinarily caring, social and popular people, always eager to help.",
        strengths: ["Strong Practical Skills", "Duty", "Loyal", "Sensitive"],
        weaknesses: ["Worried about Status", "Inflexible", "Needy"],
        hobbies: ["Cooking for others", "Event Organizing", "Socializing", "Charity"],
        careers: [
            { role: "Event Planner", match: 98 },
            { role: "Nurse", match: 96 },
            { role: "Office Manager", match: 94 },
            { role: "Teacher", match: 92 },
            { role: "Counselor", match: 90 }
        ],
        characters: [
            { name: "SpongeBob SquarePants", source: "Nickelodeon" },
            { name: "Woody", source: "Toy Story" },
            { name: "Monica Geller", source: "Friends" },
            { name: "Sansa Stark", source: "Game of Thrones" }
        ],
        movies: [
            { title: "Mean Girls", genre: "Comedy" },
            { title: "Clueless", genre: "Comedy" },
            { title: "Legally Blonde", genre: "Comedy" },
            { title: "The Help", genre: "Drama" }
        ],
        quote: "Kindness is the language which the deaf can hear and the blind can see."
    },

    // EXPLORERS
    ISTP: {
        title: "The Virtuoso",
        tagline: "Bold and practical experimenters, masters of all kinds of tools.",
        strengths: ["Optimistic", "Creative", "Practical", "Spontaneous"],
        weaknesses: ["Stubborn", "Insensitive", "Private", "Easily Bored"],
        hobbies: ["Mechanics", "Extreme Sports", "Carpentry", "Video Games"],
        careers: [
            { role: "Engineer", match: 98 },
            { role: "Mechanic", match: 96 },
            { role: "Pilot", match: 94 },
            { role: "Forensic Scientist", match: 92 },
            { role: "Paramedic", match: 90 }
        ],
        characters: [
            { name: "Indiana Jones", source: "Indiana Jones" },
            { name: "Arya Stark", source: "Game of Thrones" },
            { name: "John Wick", source: "John Wick" },
            { name: "Han Solo", source: "Star Wars" }
        ],
        movies: [
            { title: "Drive", genre: "Acion/Crime" },
            { title: "The Bourne Identity", genre: "Action" },
            { title: "Top Gun", genre: "Action" },
            { title: "Mad Max: Fury Road", genre: "Action/Sci-Fi" }
        ],
        quote: "I want to do it because I want to do it. Women need a reason to have sex. Men just need a place."
    },
    ISFP: {
        title: "The Adventurer",
        tagline: "Flexible and charming artists, always ready to explore and experience something new.",
        strengths: ["Charming", "Sensitive", "Imaginative", "Passionate"],
        weaknesses: ["Fiercely Independent", "Unpredictable", "Easily Stressed"],
        hobbies: ["Art", "Music", "Nature Walks", "Fashion Design"],
        careers: [
            { role: "Artist", match: 98 },
            { role: "Musician", match: 96 },
            { role: "Chef", match: 94 },
            { role: "Designer", match: 92 },
            { role: "Veterinarian", match: 90 }
        ],
        characters: [
            { name: "Harry Potter", source: "Harry Potter" },
            { name: "Eleven", source: "Stranger Things" },
            { name: "Jon Snow", source: "Game of Thrones" },
            { name: "Legolas", source: "Lord of the Rings" }
        ],
        movies: [
            { title: "Amélie", genre: "Romance" },
            { title: "Moonrise Kingdom", genre: "Adventure" },
            { title: "Lost in Translation", genre: "Drama" },
            { title: "Call Me by Your Name", genre: "Drama/Romance" }
        ],
        quote: "I found I could say things with color and shapes that I couldn't say any other way."
    },
    ESTP: {
        title: "The Entrepreneur",
        tagline: "Smart, energetic and very perceptive people, who truly enjoy living on the edge.",
        strengths: ["Bold", "Rational", "Original", "Perceptive"],
        weaknesses: ["Insensitive", "Impatient", "Risk-prone"],
        hobbies: ["Sports", "Gambling", "Sales", "Partying"],
        careers: [
            { role: "Entrepreneur", match: 99 },
            { role: "Sales Rep", match: 96 },
            { role: "Stockbroker", match: 94 },
            { role: "Police Officer", match: 92 },
            { role: "Athlete", match: 95 }
        ],
        characters: [
            { name: "Thor", source: "Marvel" },
            { name: "Jaime Lannister", source: "Game of Thrones" },
            { name: "Rocket Raccoon", source: "Guardians of the Galaxy" },
            { name: "Maverick", source: "Top Gun" }
        ],
        movies: [
            { title: "Casino Royale", genre: "Action" },
            { title: "Limitless", genre: "Sci-Fi/Thriller" },
            { title: "Ocean's Eleven", genre: "Crime/Thriller" },
            { title: "The Hangover", genre: "Comedy" }
        ],
        quote: "You miss 100% of the shots you don't take."
    },
    ESFP: {
        title: "The Entertainer",
        tagline: "Spontaneous, energetic and enthusiastic people - life is never boring around them.",
        strengths: ["Bold", "Original", "Aesthetics", "Practical"],
        weaknesses: ["Sensitive", "Conflict-Averse", "Easily Bored"],
        hobbies: ["Dancing", "Acting", "Hosting Parties", "Travel"],
        careers: [
            { role: "Actor", match: 98 },
            { role: "Event Planner", match: 96 },
            { role: "Sales Rep", match: 94 },
            { role: "Tour Guide", match: 92 },
            { role: "Fashion Designer", match: 90 }
        ],
        characters: [
            { name: "Harley Quinn", source: "DC Comics" },
            { name: "Joey Tribbiani", source: "Friends" },
            { name: "Peter Quill (Star-Lord)", source: "Marvel" },
            { name: "Jack Dawson", source: "Titanic" }
        ],
        movies: [
            { title: "The Great Gatsby", genre: "Drama" },
            { title: "Moulin Rouge!", genre: "Musical" },
            { title: "Magic Mike", genre: "Comedy/Drama" },
            { title: "Project X", genre: "Comedy" }
        ],
        quote: "Life is a party, dress like it."
    }
};
