import type { Question } from '../types';

// --- MATH QUESTIONS ---
export const mathQuestions: Question[] = [
  // Easy (addition 1-10)
  { q: "2 + 3 = ?", options: [4, 5, 6], a: 5, difficulty: 'easy' },
  { q: "1 + 4 = ?", options: [3, 5, 6], a: 5, difficulty: 'easy' },
  { q: "3 + 3 = ?", options: [5, 6, 7], a: 6, difficulty: 'easy' },
  { q: "5 + 2 = ?", options: [6, 7, 8], a: 7, difficulty: 'easy' },
  { q: "4 + 1 = ?", options: [4, 5, 6], a: 5, difficulty: 'easy' },
  { q: "2 + 2 = ?", options: [3, 4, 5], a: 4, difficulty: 'easy' },
  { q: "6 + 1 = ?", options: [6, 7, 8], a: 7, difficulty: 'easy' },
  { q: "3 + 4 = ?", options: [6, 7, 8], a: 7, difficulty: 'easy' },
  { q: "1 + 1 = ?", options: [1, 2, 3], a: 2, difficulty: 'easy' },
  { q: "5 + 3 = ?", options: [7, 8, 9], a: 8, difficulty: 'easy' },
  { q: "4 + 4 = ?", options: [7, 8, 9], a: 8, difficulty: 'easy' },
  { q: "7 + 2 = ?", options: [8, 9, 10], a: 9, difficulty: 'easy' },
  { q: "6 + 3 = ?", options: [8, 9, 10], a: 9, difficulty: 'easy' },
  { q: "1 + 8 = ?", options: [8, 9, 10], a: 9, difficulty: 'easy' },
  { q: "3 + 2 = ?", options: [4, 5, 6], a: 5, difficulty: 'easy' },
  // Medium (addition/subtraction 1-20)
  { q: "12 + 5 = ?", options: [16, 17, 18], a: 17, difficulty: 'medium' },
  { q: "15 - 7 = ?", options: [7, 8, 9], a: 8, difficulty: 'medium' },
  { q: "9 + 8 = ?", options: [16, 17, 18], a: 17, difficulty: 'medium' },
  { q: "20 - 6 = ?", options: [13, 14, 15], a: 14, difficulty: 'medium' },
  { q: "11 + 9 = ?", options: [18, 19, 20], a: 20, difficulty: 'medium' },
  { q: "16 - 8 = ?", options: [7, 8, 9], a: 8, difficulty: 'medium' },
  { q: "7 + 6 = ?", options: [12, 13, 14], a: 13, difficulty: 'medium' },
  { q: "14 - 5 = ?", options: [8, 9, 10], a: 9, difficulty: 'medium' },
  { q: "8 + 7 = ?", options: [14, 15, 16], a: 15, difficulty: 'medium' },
  { q: "18 - 9 = ?", options: [8, 9, 10], a: 9, difficulty: 'medium' },
  { q: "13 + 6 = ?", options: [18, 19, 20], a: 19, difficulty: 'medium' },
  { q: "17 - 8 = ?", options: [8, 9, 10], a: 9, difficulty: 'medium' },
  { q: "6 + 9 = ?", options: [14, 15, 16], a: 15, difficulty: 'medium' },
  { q: "19 - 7 = ?", options: [11, 12, 13], a: 12, difficulty: 'medium' },
  { q: "15 + 4 = ?", options: [18, 19, 20], a: 19, difficulty: 'medium' },
  // Hard (multiplication basics)
  { q: "3 × 4 = ?", options: [10, 11, 12], a: 12, difficulty: 'hard' },
  { q: "5 × 2 = ?", options: [8, 10, 12], a: 10, difficulty: 'hard' },
  { q: "6 × 3 = ?", options: [15, 18, 21], a: 18, difficulty: 'hard' },
  { q: "4 × 5 = ?", options: [18, 20, 22], a: 20, difficulty: 'hard' },
  { q: "7 × 2 = ?", options: [12, 14, 16], a: 14, difficulty: 'hard' },
  { q: "2 × 8 = ?", options: [14, 16, 18], a: 16, difficulty: 'hard' },
  { q: "3 × 5 = ?", options: [12, 15, 18], a: 15, difficulty: 'hard' },
  { q: "9 × 2 = ?", options: [16, 18, 20], a: 18, difficulty: 'hard' },
  { q: "4 × 4 = ?", options: [14, 16, 18], a: 16, difficulty: 'hard' },
  { q: "6 × 2 = ?", options: [10, 12, 14], a: 12, difficulty: 'hard' },
  { q: "5 × 5 = ?", options: [20, 25, 30], a: 25, difficulty: 'hard' },
  { q: "3 × 7 = ?", options: [18, 21, 24], a: 21, difficulty: 'hard' },
  { q: "8 × 3 = ?", options: [21, 24, 27], a: 24, difficulty: 'hard' },
  { q: "2 × 9 = ?", options: [16, 18, 20], a: 18, difficulty: 'hard' },
  { q: "4 × 6 = ?", options: [22, 24, 26], a: 24, difficulty: 'hard' },
];

// --- SPELLING QUESTIONS ---
export const spellingQuestions: Question[] = [
  // Easy
  { q: "Find the missing letter: C _ T", options: ['A', 'E', 'O'], a: 'A', difficulty: 'easy' },
  { q: "Find the missing letter: D O _", options: ['G', 'B', 'P'], a: 'G', difficulty: 'easy' },
  { q: "Find the missing letter: S U _", options: ['N', 'M', 'P'], a: 'N', difficulty: 'easy' },
  { q: "Find the missing letter: _ A T", options: ['B', 'D', 'K'], a: 'B', difficulty: 'easy' },
  { q: "Find the missing letter: P _ G", options: ['I', 'A', 'U'], a: 'I', difficulty: 'easy' },
  { q: "Find the missing letter: H _ T", options: ['A', 'O', 'I'], a: 'A', difficulty: 'easy' },
  { q: "Find the missing letter: C U _", options: ['P', 'T', 'B'], a: 'P', difficulty: 'easy' },
  { q: "Find the missing letter: R _ N", options: ['U', 'A', 'I'], a: 'U', difficulty: 'easy' },
  { q: "Find the missing letter: _ E D", options: ['R', 'B', 'L'], a: 'R', difficulty: 'easy' },
  { q: "Find the missing letter: F _ N", options: ['U', 'A', 'I'], a: 'U', difficulty: 'easy' },
  { q: "Find the missing letter: B _ G", options: ['U', 'A', 'I'], a: 'A', difficulty: 'easy' },
  { q: "Find the missing letter: M _ P", options: ['A', 'O', 'I'], a: 'A', difficulty: 'easy' },
  { q: "Find the missing letter: T _ P", options: ['O', 'A', 'I'], a: 'O', difficulty: 'easy' },
  { q: "Find the missing letter: J _ T", options: ['E', 'A', 'U'], a: 'E', difficulty: 'easy' },
  { q: "Find the missing letter: L _ G", options: ['O', 'A', 'E'], a: 'O', difficulty: 'easy' },
  // Medium
  { q: "Which spells a fruit? 🍎", options: ['APLE', 'APPLE', 'APPEL'], a: 'APPLE', difficulty: 'medium' },
  { q: "Which spells a color? 🟢", options: ['GREN', 'GREAN', 'GREEN'], a: 'GREEN', difficulty: 'medium' },
  { q: "Which spells an animal? 🐴", options: ['HORSE', 'HORS', 'HOARSE'], a: 'HORSE', difficulty: 'medium' },
  { q: "Which is correct?", options: ['HOUSE', 'HOUS', 'HOWSE'], a: 'HOUSE', difficulty: 'medium' },
  { q: "Which is correct?", options: ['SKOOL', 'SCHOOL', 'SCHOL'], a: 'SCHOOL', difficulty: 'medium' },
  { q: "Which is correct?", options: ['FREND', 'FREIND', 'FRIEND'], a: 'FRIEND', difficulty: 'medium' },
  { q: "Which is correct? 👶", options: ['CHILD', 'CHILED', 'CHILDE'], a: 'CHILD', difficulty: 'medium' },
  { q: "Which is correct? 🌊", options: ['WATER', 'WARTER', 'WOTER'], a: 'WATER', difficulty: 'medium' },
  { q: "Which is correct? 📖", options: ['STOREY', 'STORY', 'STORIE'], a: 'STORY', difficulty: 'medium' },
  { q: "Which is correct? 🌙", options: ['NITE', 'NIGHT', 'NIGT'], a: 'NIGHT', difficulty: 'medium' },
  { q: "Which is correct? 🎵", options: ['MUSIK', 'MUZIC', 'MUSIC'], a: 'MUSIC', difficulty: 'medium' },
  { q: "Which is correct? 🏠", options: ['FAMLY', 'FAMLIY', 'FAMILY'], a: 'FAMILY', difficulty: 'medium' },
  { q: "Which is correct? 🐱", options: ['KITTEN', 'KITEN', 'KITTAN'], a: 'KITTEN', difficulty: 'medium' },
  { q: "Which is correct? 🌺", options: ['FLOWER', 'FLOWR', 'FLOUR'], a: 'FLOWER', difficulty: 'medium' },
  { q: "Which is correct? 🦋", options: ['BUTERFLY', 'BUTTERFLY', 'BUTTERFLI'], a: 'BUTTERFLY', difficulty: 'medium' },
  // Hard
  { q: "Which is correct? 🦕", options: ['DINOSAUR', 'DINOSOAR', 'DINASAUR'], a: 'DINOSAUR', difficulty: 'hard' },
  { q: "Which is correct? 🌍", options: ['DIFERENT', 'DIFFERENT', 'DIFFRENT'], a: 'DIFFERENT', difficulty: 'hard' },
  { q: "Which is correct?", options: ['BEAUTFUL', 'BEAUTIFULL', 'BEAUTIFUL'], a: 'BEAUTIFUL', difficulty: 'hard' },
  { q: "Which is correct?", options: ['BECAUSE', 'BECAUS', 'BECUASE'], a: 'BECAUSE', difficulty: 'hard' },
  { q: "Which is correct?", options: ['LIBARY', 'LIBRARY', 'LIEBRARY'], a: 'LIBRARY', difficulty: 'hard' },
  { q: "Which is correct?", options: ['CALENDER', 'CALENDAR', 'CALANDAR'], a: 'CALENDAR', difficulty: 'hard' },
  { q: "Which is correct? 💪", options: ['EXERCISE', 'EXERSICE', 'EXERCIZE'], a: 'EXERCISE', difficulty: 'hard' },
  { q: "Which is correct? 🧪", options: ['SIENCE', 'SCIENCE', 'SCIENEC'], a: 'SCIENCE', difficulty: 'hard' },
  { q: "Which is correct?", options: ['IMAJINE', 'IMAGIN', 'IMAGINE'], a: 'IMAGINE', difficulty: 'hard' },
  { q: "Which is correct?", options: ['TOGEHTER', 'TOGETHER', 'TOGATHER'], a: 'TOGETHER', difficulty: 'hard' },
];

// --- LOGIC / PATTERN QUESTIONS ---
export const logicQuestions: Question[] = [
  // Easy
  { q: "🔴🔵🔴🔵 — What comes next?", options: ['🔴', '🔵', '🟢'], a: '🔴', difficulty: 'easy' },
  { q: "⭐🌙⭐🌙 — What comes next?", options: ['⭐', '🌙', '☀️'], a: '⭐', difficulty: 'easy' },
  { q: "🐱🐶🐱🐶 — What comes next?", options: ['🐱', '🐶', '🐰'], a: '🐱', difficulty: 'easy' },
  { q: "Which is biggest? 🐘🐱🐭", options: ['Elephant', 'Cat', 'Mouse'], a: 'Elephant', difficulty: 'easy' },
  { q: "Which is smallest? 🏠🏢🏰", options: ['House', 'Building', 'Castle'], a: 'House', difficulty: 'easy' },
  { q: "What is the odd one out? 🍎🍌🚗🍊", options: ['Apple', 'Car', 'Banana'], a: 'Car', difficulty: 'easy' },
  { q: "1, 2, 3, _ — What's next?", options: [4, 5, 6], a: 4, difficulty: 'easy' },
  { q: "What comes after Monday?", options: ['Tuesday', 'Wednesday', 'Sunday'], a: 'Tuesday', difficulty: 'easy' },
  { q: "How many legs does a dog have?", options: [2, 4, 6], a: 4, difficulty: 'easy' },
  { q: "Which season is cold? ❄️", options: ['Summer', 'Winter', 'Spring'], a: 'Winter', difficulty: 'easy' },
  { q: "What color is the sky? ☀️", options: ['Blue', 'Green', 'Red'], a: 'Blue', difficulty: 'easy' },
  { q: "What do bees make? 🐝", options: ['Milk', 'Honey', 'Juice'], a: 'Honey', difficulty: 'easy' },
  { q: "Which animal says 'Moo'? 🐄", options: ['Dog', 'Cat', 'Cow'], a: 'Cow', difficulty: 'easy' },
  { q: "How many days in a week?", options: [5, 6, 7], a: 7, difficulty: 'easy' },
  { q: "What shape has 3 sides?", options: ['Square', 'Triangle', 'Circle'], a: 'Triangle', difficulty: 'easy' },
  // Medium
  { q: "2, 4, 6, _ — What's next?", options: [7, 8, 9], a: 8, difficulty: 'medium' },
  { q: "5, 10, 15, _ — What's next?", options: [18, 20, 25], a: 20, difficulty: 'medium' },
  { q: "🟦🟦🟨🟦🟦🟨 — Next?", options: ['🟦', '🟨', '🟥'], a: '🟦', difficulty: 'medium' },
  { q: "Which doesn't belong? 🎸🎹🎺📚", options: ['Guitar', 'Book', 'Piano'], a: 'Book', difficulty: 'medium' },
  { q: "If today is Wed, what's tomorrow?", options: ['Tuesday', 'Thursday', 'Friday'], a: 'Thursday', difficulty: 'medium' },
  { q: "Which month comes after March?", options: ['April', 'May', 'February'], a: 'April', difficulty: 'medium' },
  { q: "How many sides does a hexagon have?", options: [5, 6, 8], a: 6, difficulty: 'medium' },
  { q: "Which is NOT a planet?", options: ['Mars', 'Moon', 'Venus'], a: 'Moon', difficulty: 'medium' },
  { q: "3, 6, 9, _ — What's next?", options: [10, 11, 12], a: 12, difficulty: 'medium' },
  { q: "If A=1, B=2, C=?", options: [3, 4, 5], a: 3, difficulty: 'medium' },
  { q: "🔺🔺🔻🔺🔺🔻 — Next?", options: ['🔺', '🔻', '⬛'], a: '🔺', difficulty: 'medium' },
  { q: "Which is heavier: a kg of rocks or feathers?", options: ['Rocks', 'Feathers', 'Same'], a: 'Same', difficulty: 'medium' },
  { q: "How many hours in a day?", options: [12, 20, 24], a: 24, difficulty: 'medium' },
  { q: "1, 1, 2, 3, 5, _ — Next?", options: [6, 7, 8], a: 8, difficulty: 'medium' },
  { q: "What has hands but can't clap?", options: ['A monkey', 'A clock', 'A robot'], a: 'A clock', difficulty: 'medium' },
  // Hard
  { q: "10, 20, 30, _, 50", options: [35, 40, 45], a: 40, difficulty: 'hard' },
  { q: "64, 32, 16, _ — What's next?", options: [4, 8, 12], a: 8, difficulty: 'hard' },
  { q: "If all roses are flowers, are all flowers roses?", options: ['Yes', 'No', 'Maybe'], a: 'No', difficulty: 'hard' },
  { q: "100, 90, 80, _, 60", options: [65, 70, 75], a: 70, difficulty: 'hard' },
  { q: "Which shape has the most sides?", options: ['Pentagon', 'Hexagon', 'Octagon'], a: 'Octagon', difficulty: 'hard' },
  { q: "How many minutes in an hour?", options: [30, 60, 100], a: 60, difficulty: 'hard' },
  { q: "2, 4, 8, 16, _ — Next?", options: [18, 24, 32], a: 32, difficulty: 'hard' },
  { q: "What fraction is half?", options: ['1/3', '1/2', '1/4'], a: '1/2', difficulty: 'hard' },
  { q: "Which number is prime?", options: [4, 7, 9], a: 7, difficulty: 'hard' },
  { q: "Rearrange: T-A-R-S", options: ['TARS', 'STAR', 'RATS'], a: 'STAR', difficulty: 'hard' },
];

// --- SCIENCE QUESTIONS ---
export const scienceQuestions: Question[] = [
  { q: "What do plants need to grow? 🌱", options: ['Sunlight', 'Darkness', 'Snow'], a: 'Sunlight', difficulty: 'easy' },
  { q: "What do fish breathe with?", options: ['Lungs', 'Gills', 'Nose'], a: 'Gills', difficulty: 'easy' },
  { q: "Is the Sun a star or a planet?", options: ['Star', 'Planet', 'Moon'], a: 'Star', difficulty: 'easy' },
  { q: "What covers most of Earth? 🌍", options: ['Land', 'Water', 'Ice'], a: 'Water', difficulty: 'easy' },
  { q: "Which sense uses your eyes?", options: ['Hearing', 'Sight', 'Smell'], a: 'Sight', difficulty: 'easy' },
  { q: "What falls from clouds? ☁️", options: ['Rocks', 'Rain', 'Stars'], a: 'Rain', difficulty: 'easy' },
  { q: "How many legs does a spider have?", options: [6, 8, 10], a: 8, difficulty: 'easy' },
  { q: "Which animal is a mammal?", options: ['Snake', 'Whale', 'Frog'], a: 'Whale', difficulty: 'easy' },
  { q: "What comes from an egg? 🥚", options: ['Chick', 'Puppy', 'Kitten'], a: 'Chick', difficulty: 'easy' },
  { q: "What gives us light during the day?", options: ['Moon', 'Stars', 'Sun'], a: 'Sun', difficulty: 'easy' },
  { q: "Where does a caterpillar become a butterfly?", options: ['Nest', 'Cocoon', 'Hole'], a: 'Cocoon', difficulty: 'medium' },
  { q: "What is the largest planet?", options: ['Earth', 'Jupiter', 'Mars'], a: 'Jupiter', difficulty: 'medium' },
  { q: "What gas do we breathe in?", options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen'], a: 'Oxygen', difficulty: 'medium' },
  { q: "How many bones does an adult have?", options: [106, 206, 306], a: 206, difficulty: 'medium' },
  { q: "What part of the plant absorbs water?", options: ['Leaf', 'Root', 'Flower'], a: 'Root', difficulty: 'medium' },
  { q: "What causes day and night?", options: ['Wind', "Earth's rotation", 'Clouds'], a: "Earth's rotation", difficulty: 'medium' },
  { q: "Which planet has rings? 🪐", options: ['Mars', 'Saturn', 'Venus'], a: 'Saturn', difficulty: 'medium' },
  { q: "What is H2O?", options: ['Air', 'Water', 'Fire'], a: 'Water', difficulty: 'medium' },
  { q: "What animal has the longest neck?", options: ['Elephant', 'Giraffe', 'Horse'], a: 'Giraffe', difficulty: 'medium' },
  { q: "What is a group of lions called?", options: ['Pack', 'Pride', 'Flock'], a: 'Pride', difficulty: 'medium' },
  { q: "What force keeps us on the ground?", options: ['Magnetism', 'Gravity', 'Wind'], a: 'Gravity', difficulty: 'hard' },
  { q: "What is the hardest natural substance?", options: ['Gold', 'Iron', 'Diamond'], a: 'Diamond', difficulty: 'hard' },
  { q: "At what temp does water boil (°C)?", options: [50, 100, 200], a: 100, difficulty: 'hard' },
  { q: "Which planet is closest to the Sun?", options: ['Venus', 'Mercury', 'Earth'], a: 'Mercury', difficulty: 'hard' },
  { q: "What element do plants produce?", options: ['Oxygen', 'Carbon', 'Nitrogen'], a: 'Oxygen', difficulty: 'hard' },
];

// --- GEOGRAPHY QUESTIONS ---
export const geographyQuestions: Question[] = [
  { q: "What shape is the Earth? 🌍", options: ['Flat', 'Round', 'Square'], a: 'Round', difficulty: 'easy' },
  { q: "What is the biggest ocean?", options: ['Atlantic', 'Pacific', 'Indian'], a: 'Pacific', difficulty: 'easy' },
  { q: "Which direction does the Sun rise?", options: ['East', 'West', 'North'], a: 'East', difficulty: 'easy' },
  { q: "What is at the North Pole? 🐧", options: ['Desert', 'Ice', 'Jungle'], a: 'Ice', difficulty: 'easy' },
  { q: "Which one is a continent?", options: ['Asia', 'France', 'Texas'], a: 'Asia', difficulty: 'easy' },
  { q: "What is an island?", options: ['Land in water', 'Mountain', 'Desert'], a: 'Land in water', difficulty: 'easy' },
  { q: "What animal lives in Antarctica? 🐧", options: ['Lion', 'Penguin', 'Monkey'], a: 'Penguin', difficulty: 'easy' },
  { q: "Deserts are very…", options: ['Wet', 'Dry', 'Cold'], a: 'Dry', difficulty: 'easy' },
  { q: "What shows countries? 🗺️", options: ['Clock', 'Map', 'Book'], a: 'Map', difficulty: 'easy' },
  { q: "What is the tallest mountain?", options: ['K2', 'Everest', 'Kilimanjaro'], a: 'Everest', difficulty: 'easy' },
  { q: "What is the longest river?", options: ['Amazon', 'Nile', 'Thames'], a: 'Nile', difficulty: 'medium' },
  { q: "Which country has the most people?", options: ['USA', 'India', 'Russia'], a: 'India', difficulty: 'medium' },
  { q: "What is the capital of France?", options: ['London', 'Paris', 'Berlin'], a: 'Paris', difficulty: 'medium' },
  { q: "How many continents are there?", options: [5, 6, 7], a: 7, difficulty: 'medium' },
  { q: "What is the biggest desert?", options: ['Sahara', 'Gobi', 'Antarctic'], a: 'Antarctic', difficulty: 'medium' },
  { q: "What ocean is between USA & Europe?", options: ['Pacific', 'Atlantic', 'Indian'], a: 'Atlantic', difficulty: 'medium' },
  { q: "Which country looks like a boot?", options: ['Spain', 'Italy', 'Greece'], a: 'Italy', difficulty: 'medium' },
  { q: "The Amazon is in which continent?", options: ['Asia', 'Africa', 'S. America'], a: 'S. America', difficulty: 'medium' },
  { q: "Where are the Pyramids? 🏛️", options: ['Mexico', 'Egypt', 'India'], a: 'Egypt', difficulty: 'medium' },
  { q: "What country has kangaroos? 🦘", options: ['Brazil', 'Australia', 'Canada'], a: 'Australia', difficulty: 'medium' },
  { q: "What is the smallest country?", options: ['Monaco', 'Vatican', 'Malta'], a: 'Vatican', difficulty: 'hard' },
  { q: "What is the capital of Japan?", options: ['Beijing', 'Seoul', 'Tokyo'], a: 'Tokyo', difficulty: 'hard' },
  { q: "What is the deepest ocean trench?", options: ['Tonga', 'Mariana', 'Java'], a: 'Mariana', difficulty: 'hard' },
  { q: "What line divides N & S hemispheres?", options: ['Equator', 'Meridian', 'Tropic'], a: 'Equator', difficulty: 'hard' },
  { q: "What country is both in Europe & Asia?", options: ['Russia', 'Turkey', 'Both'], a: 'Both', difficulty: 'hard' },
];

// --- MEMORY / TRIVIA QUESTIONS ---
export const memoryQuestions: Question[] = [
  { q: "Which animal has a shell? 🐢", options: ['Turtle', 'Bird', 'Fish'], a: 'Turtle', difficulty: 'easy' },
  { q: "Which one can fly? 🐦", options: ['Turtle', 'Bird', 'Fish'], a: 'Bird', difficulty: 'easy' },
  { q: "Which one lives in water? 🐟", options: ['Dog', 'Cat', 'Fish'], a: 'Fish', difficulty: 'easy' },
  { q: "What color is a banana? 🍌", options: ['Red', 'Yellow', 'Blue'], a: 'Yellow', difficulty: 'easy' },
  { q: "How many wheels on a car? 🚗", options: [2, 3, 4], a: 4, difficulty: 'easy' },
  { q: "What sound does a cat make?", options: ['Woof', 'Meow', 'Moo'], a: 'Meow', difficulty: 'easy' },
  { q: "What is frozen water called?", options: ['Steam', 'Ice', 'Juice'], a: 'Ice', difficulty: 'easy' },
  { q: "What do you wear on your feet?", options: ['Hat', 'Shoes', 'Gloves'], a: 'Shoes', difficulty: 'easy' },
  { q: "What meal is in the morning? 🌅", options: ['Lunch', 'Breakfast', 'Dinner'], a: 'Breakfast', difficulty: 'easy' },
  { q: "What has a trunk? 🐘", options: ['Elephant', 'Cat', 'Bird'], a: 'Elephant', difficulty: 'easy' },
  { q: "What is the opposite of hot?", options: ['Warm', 'Cold', 'Wet'], a: 'Cold', difficulty: 'medium' },
  { q: "What is baby dog called?", options: ['Kitten', 'Puppy', 'Cub'], a: 'Puppy', difficulty: 'medium' },
  { q: "What instrument has black & white keys?", options: ['Guitar', 'Piano', 'Drum'], a: 'Piano', difficulty: 'medium' },
  { q: "What is a group of fish called?", options: ['Pack', 'School', 'Flock'], a: 'School', difficulty: 'medium' },
  { q: "How many vowels in English?", options: [3, 5, 7], a: 5, difficulty: 'medium' },
];

// --- Helpers ---
export function getQuestionsByDifficulty(questions: Question[], difficulty: string): Question[] {
  if (difficulty === 'all') return [...questions].sort(() => Math.random() - 0.5);
  return questions.filter(q => q.difficulty === difficulty).sort(() => Math.random() - 0.5);
}

export function generateMathQuestion(difficulty: string): Question {
  let num1: number, num2: number, op: string, answer: number;
  const opts: number[] = [];

  if (difficulty === 'easy') {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
    op = '+';
    answer = num1 + num2;
  } else if (difficulty === 'medium') {
    const isAdd = Math.random() > 0.4;
    num1 = Math.floor(Math.random() * 20) + 5;
    num2 = Math.floor(Math.random() * 10) + 1;
    if (isAdd) { op = '+'; answer = num1 + num2; }
    else { op = '-'; answer = num1 - num2; }
  } else {
    num1 = Math.floor(Math.random() * 10) + 2;
    num2 = Math.floor(Math.random() * 10) + 2;
    op = '×';
    answer = num1 * num2;
  }

  opts.push(answer);
  while (opts.length < 3) {
    const wrong = answer + Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1);
    if (wrong !== answer && wrong > 0 && !opts.includes(wrong)) opts.push(wrong);
    else opts.push(answer + opts.length + 1);
  }

  return {
    q: `${num1} ${op} ${num2} = ?`,
    options: opts.sort(() => Math.random() - 0.5),
    a: answer,
    difficulty: difficulty as 'easy' | 'medium' | 'hard',
  };
}

export const allSubjects = {
  Math: { title: 'Pirate Math!', icon: '🧮', questions: mathQuestions },
  Spelling: { title: 'Word Ninja!', icon: '📖', questions: spellingQuestions },
  Logic: { title: 'Brain Teasers!', icon: '🧩', questions: logicQuestions },
  Science: { title: 'Science Lab!', icon: '🔬', questions: scienceQuestions },
  Geography: { title: 'World Explorer!', icon: '🌍', questions: geographyQuestions },
  Memory: { title: 'Memory Master!', icon: '🧠', questions: memoryQuestions },
};
