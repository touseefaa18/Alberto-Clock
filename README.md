                            ALBERTO CLOCKS

## 📌 PROJECT OVERVIEW

Alberto Clocks is a premium, front-end web project built for a luxury Swiss watch brand. The website is designed to look highly professional, expensive, and exclusive. It uses smooth animations, a dark luxury theme, and dynamically loads product data to create a high-end shopping experience.


## 🛠️ TECHNOLOGY STACK


The project is built using standard and reliable web technologies:

 ...HTML5: For the main structure and content of the site.
...CSS3 (Custom): For the rich styling, colors, and layout.
...JavaScript (Vanilla JS) & jQuery: To control all the interactivity, animations, and data fetching.
...Bootstrap: To ensure the layout is fully responsive and looks perfect on mobile devices.
...JSON: Used as a local database to store all the watch details.



## 📁 PROJECT FOLDER STRUCTURE

index.html: The main webpage where everything is displayed.

style.css: Contains all your custom design rules (colors, fonts, animations).

main.js: The most important logic file that runs all your dynamic features.

data/watches.json: The file that holds the data (price, name, image) for all the watches.

Assets/: The folder containing all your media, including high-quality .webp images of luxury brands (Bulova, Citizen, etc.) and your background video.

css/ & js/: Folders containing the Bootstrap and jQuery helper files.

## 📁 Project Structure

Alberto-Clock/
│
├── Assets/                 # Images of watches and screenshots
├── css/                    # Bootstrap CSS files
├── data                    # Json  file
├── js/                     # Bootstrap JS files
├── index.html              # Main webpage structure
├── style.css               # Custom styling and color themes
├── main.js                 # Scroll animations script
├── jquery.js               # jQuery library
└── README.md               # Project documentation


## ⚡ CORE FEATURES AND FUNCTIONALITY

1. Dynamic Product Loading (JSON Integration)
Instead of hard-coding every single watch into the HTML, your main.js uses a fetch() function to read watches.json. It automatically takes the watch data (like "The Sovereign" watch, price, and specs) and creates the product cards on the screen. This makes adding new watches in the future very easy.

2. Custom Luxury Cursor
The default computer mouse pointer is hidden and replaced with a custom-designed cursor (a dot and a trailing circle) that follows the user's mouse, adding a unique feel to the site.

3. Preloader Screen
When a user opens the website, they see a loading screen first. The site hides the content and prevents scrolling until all videos, images, and scripts are fully loaded. After 1.2 seconds, it smoothly reveals the website.

4. Advanced Animations & Visual Effects
Hero Particle Canvas: The top banner features an interactive canvas with moving particles, layered over a Parallax Hero Video.
Scroll-Reveal: As the user scrolls down, text, images, and cards don't just sit there—they smoothly fade or slide into view.
3D Card Tilt: When a user hovers their mouse over a watch product card, the card gently tilts in 3D space, making it feel touchable and premium.

5. Smart Navigation (Navbar)
Active Highlighting: As you scroll through different sections of the website, the top menu automatically highlights which section you are currently reading (using an Intersection Observer).
Glass Progress Bar: There is a tracking bar on the navigation menu that fills up as you scroll down the page, showing your reading progress.
Smooth Scrolling: Clicking any link in the menu smoothly glides the screen to that section instead of instantly jumping.

6. Interactive UI Elements
Animated Counters: Numbers on the screen (like years of experience or watches sold) count up dynamically when you scroll to them.
Testimonials Slider: A swipeable carousel where users can read customer reviews.
Gallery Lightbox: Clicking on an image enlarges it into a full-screen popup view without making the user leave the page.
Mobile Menu: A stylish hamburger menu that opens cleanly for phone and tablet users.



## 🎨 DESIGN AND THEME

The project relies on CSS Variables (:root) to maintain a strict luxury color palette.

Colors: The background is very dark (almost black with a green/teal tint like #08100f). It uses Gold (#c9a86c) and Copper (#b87040) for text, borders, and glowing effects.

Typography: The site uses elegant, classic fonts. Cinzel and Cormorant Garamond are used for big headings to give a traditional Swiss feel, while Montserrat is used for normal paragraphs so they are easy to read.

## GITHUB
Repository Link/URL : " https://github.com/touseefaa18/Alberto-Clock.git "

## GITHUB REPOSITORY COMMANDS 
echo "# Alberto-Clock" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/touseefaa18/Alberto-Clock.git
git push -u origin main



git remote add origin https://github.com/touseefaa18/Alberto-Clock.git
git branch -M main
git push -u origin main

## DEPLOYMENT
This project is deployed on vercel through CI CD pipeline with github

VERCEL LINK : " https://alberto-clock-eight.vercel.app/ "