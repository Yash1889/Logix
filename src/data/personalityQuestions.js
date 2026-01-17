export const QUESTIONS = [
    // EXTRAVERSION (E) vs INTROVERSION (I)
    { id: 1, text: "I feel energized after spending extended time interacting with others.", dimension: 'EI', direction: 1 },
    { id: 2, text: "I prefer discussing ideas out loud rather than thinking them through alone.", dimension: 'EI', direction: 1 },
    { id: 3, text: "In group settings, I naturally take the initiative to speak or act.", dimension: 'EI', direction: 1 },
    { id: 4, text: "I find long periods of solitude mentally draining.", dimension: 'EI', direction: 1 },
    { id: 5, text: "I enjoy environments with high activity and stimulation.", dimension: 'EI', direction: 1 },
    { id: 6, text: "I think best when bouncing ideas off other people.", dimension: 'EI', direction: 1 },
    { id: 7, text: "I am comfortable being the center of attention when needed.", dimension: 'EI', direction: 1 },
    { id: 8, text: "I often process thoughts externally rather than internally.", dimension: 'EI', direction: 1 },
    { id: 9, text: "I seek external engagement when I feel mentally stuck.", dimension: 'EI', direction: 1 },
    { id: 10, text: "I prefer active collaboration over independent work.", dimension: 'EI', direction: 1 },
    { id: 11, text: "I feel more motivated when surrounded by others.", dimension: 'EI', direction: 1 },
    { id: 12, text: "Social interaction increases my overall energy level.", dimension: 'EI', direction: 1 },

    // SENSING (S) vs INTUITION (N)
    // Agree -> S (+1), Disagree -> N (-1)
    { id: 13, text: "I focus more on concrete facts than abstract possibilities.", dimension: 'SN', direction: 1 },
    { id: 14, text: "I trust direct experience over theoretical explanations.", dimension: 'SN', direction: 1 },
    { id: 15, text: "I prefer practical solutions over imaginative ones.", dimension: 'SN', direction: 1 },
    { id: 16, text: "I notice details that others often overlook.", dimension: 'SN', direction: 1 },
    { id: 17, text: "I am more interested in how things work now than how they might evolve.", dimension: 'SN', direction: 1 },
    { id: 18, text: "I rely on proven methods rather than experimenting with new ideas.", dimension: 'SN', direction: 1 },
    { id: 19, text: "I prefer step-by-step instructions over conceptual overviews.", dimension: 'SN', direction: 1 },
    { id: 20, text: "I feel more comfortable dealing with reality than speculation.", dimension: 'SN', direction: 1 },
    { id: 21, text: "I value accuracy more than innovation.", dimension: 'SN', direction: 1 },
    { id: 22, text: "I focus on what is tangible rather than what is implied.", dimension: 'SN', direction: 1 },
    { id: 23, text: "I prefer clarity over ambiguity.", dimension: 'SN', direction: 1 },
    { id: 24, text: "I trust what I can observe more than what I can infer.", dimension: 'SN', direction: 1 },

    // THINKING (T) vs FEELING (F)
    // Agree -> T (+1), Disagree -> F (-1)
    { id: 25, text: "I prioritize logic over emotions when making decisions.", dimension: 'TF', direction: 1 },
    { id: 26, text: "I believe fairness should be objective, not personal.", dimension: 'TF', direction: 1 },
    { id: 27, text: "I value rational analysis more than emotional harmony.", dimension: 'TF', direction: 1 },
    { id: 28, text: "I find it easy to separate feelings from facts.", dimension: 'TF', direction: 1 },
    { id: 29, text: "I prefer honest criticism over emotional reassurance.", dimension: 'TF', direction: 1 },
    { id: 30, text: "I make decisions based on consistency rather than compassion.", dimension: 'TF', direction: 1 },
    { id: 31, text: "I believe truth is more important than tact.", dimension: 'TF', direction: 1 },
    { id: 32, text: "I am comfortable making tough decisions even if they upset others.", dimension: 'TF', direction: 1 },
    { id: 33, text: "I trust structured reasoning more than personal values.", dimension: 'TF', direction: 1 },
    { id: 34, text: "I prefer efficiency over emotional considerations.", dimension: 'TF', direction: 1 },
    { id: 35, text: "I analyze problems impersonally.", dimension: 'TF', direction: 1 },
    { id: 36, text: "I value correctness more than consensus.", dimension: 'TF', direction: 1 },
    { id: 37, text: "Emotional factors should not outweigh logical conclusions.", dimension: 'TF', direction: 1 },

    // JUDGING (J) vs PERCEIVING (P)
    // Agree -> J (+1), Disagree -> P (-1)
    { id: 38, text: "I prefer having a clear plan before starting a task.", dimension: 'JP', direction: 1 },
    { id: 39, text: "I feel uneasy when things are left open-ended.", dimension: 'JP', direction: 1 },
    { id: 40, text: "I like to finish tasks well before deadlines.", dimension: 'JP', direction: 1 },
    { id: 41, text: "I feel more comfortable when decisions are finalized.", dimension: 'JP', direction: 1 },
    { id: 42, text: "I prefer structure over spontaneity.", dimension: 'JP', direction: 1 },
    { id: 43, text: "I like organizing tasks ahead of time.", dimension: 'JP', direction: 1 },
    { id: 44, text: "I find last-minute changes stressful.", dimension: 'JP', direction: 1 },
    { id: 45, text: "I prefer closure over keeping options open.", dimension: 'JP', direction: 1 },
    { id: 46, text: "I work best with schedules and routines.", dimension: 'JP', direction: 1 },
    { id: 47, text: "I dislike improvising under pressure.", dimension: 'JP', direction: 1 },
    { id: 48, text: "I prefer predictable environments.", dimension: 'JP', direction: 1 },
    { id: 49, text: "I like knowing what to expect in advance.", dimension: 'JP', direction: 1 },
    { id: 50, text: "I feel satisfied when things are settled and decided.", dimension: 'JP', direction: 1 },
];

export const SCORING = {
    "Strongly Disagree": -2,
    "Disagree": -1,
    "Neutral": 0,
    "Agree": 1,
    "Strongly Agree": 2
};

export const DIMENSIONS = {
    EI: { left: 'I', right: 'E', label: 'Introversion vs Extraversion' },
    SN: { left: 'N', right: 'S', label: 'Intuition vs Sensing' },
    TF: { left: 'F', right: 'T', label: 'Feeling vs Thinking' },
    JP: { left: 'P', right: 'J', label: 'Perceiving vs Judging' }
};

export const TYPE_DESCRIPTIONS = {
    'ISTJ': "Quiet, serious, earn success by thoroughness and dependability. Practical, matter-of-fact, realistic, and responsible. Decide logically what should be done and work toward it steadily, regardless of distractions. Take pleasure in making everything orderly and organized - their work, their home, their life. Value traditions and loyalty.",
    'ISFJ': "Quiet, friendly, responsible, and conscientious. Committed and steady in meeting their obligations. Thorough, painstaking, and accurate. Loyal, considerate, notice and remember specifics about people who are important to them, concerned with how others feel. Strive to create an orderly and harmonious environment at work and at home.",
    'INFJ': "Seek meaning and connection in ideas, relationships, and material possessions. Want to understand what motivates people and are insightful about others. Conscientious and committed to their firm values. Develop a clear vision about how best to serve the common good. Organized and decisive in implementing their vision.",
    'INTJ': "Have original minds and great drive for implementing their ideas and achieving their goals. Quickly see patterns in external events and develop long-range explanatory perspectives. When committed, organize a job and carry it through. Skeptical and independent, have high standards of competence and performance - for themselves and others.",
    'ISTP': "Tolerant and flexible, quiet observers until a problem appears, then act quickly to find workable solutions. Analyze what makes things work and readily get through large amounts of data to isolate the core of practical problems. Interested in cause-and-effect, organize facts using logical principles, value efficiency.",
    'ISFP': "Quiet, friendly, sensitive, and kind. Enjoy the present moment, what's going on around them. Like to have their own space and to work within their own time frame. Loyal and committed to their values and to people who are important to them. Dislike disagreements and conflicts, do not force their opinions or values on others.",
    'INFP': "Idealistic, loyal to their values and to people who are important to them. Want an external life that is congruent with their values. Curious, quick to see possibilities, can be catalysts for implementing ideas. Seek to understand people and to help them fulfill their potential. Adaptable, flexible, and accepting unless a value is threatened.",
    'INTP': "Seek to develop logical explanations for everything that interests them. Theoretical and abstract, interested more in ideas than in social interaction. Quiet, contained, flexible, and adaptable. Have unusual ability to focus in depth to solve problems in their area of interest. Skeptical, sometimes critical, always analytical.",
    'ESTP': "Flexible and tolerant, they take a pragmatic approach focused on immediate results. Theories and conceptual explanations bore them - they want to act energetically to solve the problem. Focus on the here-and-now, spontaneous, enjoy each moment that they can be active with others. Enjoy material comforts and style. Learn best through doing.",
    'ESFP': "Outgoing, friendly, and accepting. Exuberant lovers of life, people, and material comforts. Enjoy working with others to make things happen. Bring common sense and a realistic approach to their work, and make work fun. Flexible and spontaneous, adapt readily to new people and environments. Learn best by trying a new skill with other people.",
    'ENFP': "Warmly enthusiastic and imaginative. See life as full of possibilities. Make connections between events and information very quickly, and confidently proceed based on the patterns they see. Want a lot of affirmation from others, and readily give appreciation and support. Spontaneous and flexible, often rely on their ability to improvise and their verbal fluency.",
    'ENTP': "Quick, ingenious, stimulating, alert, and outspoken. Resourceful in solving new and challenging problems. Adept at generating conceptual possibilities and then analyzing them strategically. Good at reading other people. Bored by routine, will seldom do the same thing the same way, apt to turn to one new interest after another.",
    'ESTJ': "Practical, realistic, matter-of-fact. Decisive, quickly move to implement decisions. Organize projects and people to get things done, focus on getting results in the most efficient way possible. Take care of routine details. Have a clear set of logical standards, systematically follow them and want others to also. Forceful in implementing their plans.",
    'ESFJ': "Warmhearted, conscientious, and cooperative. Want harmony in their environment, work with determination to establish it. Like to work with others to complete tasks accurately and on time. Loyal, follow through even in small matters. Notice what others need in their day-by-day lives and try to provide it. Want to be appreciated for who they are and for what they contribute.",
    'ENFJ': "Warm, empathetic, responsive, and responsible. Highly attuned to the emotions, needs, and motivations of others. Find potential in everyone, want to help others fulfill their potential. May act as catalysts for individual and group growth. Loyal, responsive to praise and criticism. Sociable, facilitate others in a group, and provide inspiring leadership.",
    'ENTJ': "Frank, decisive, assume leadership readily. Quickly see illogical and inefficient procedures and policies, develop and implement comprehensive systems to solve organizational problems. Enjoy long-term planning and goal setting. Usually well informed, well read, enjoy expanding their knowledge and passing it on to others. Forceful in presenting their ideas."
};
