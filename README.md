# TODO app

Just another todo app in the making...

## Tech Stack

- Frontend: React with Vite
- Backend: Node.js with Express
- Database: PostgreSQL
- Containerization: Docker

## Development Setup

1. Make sure you have Docker installed on your system
2. Clone the repository
3. Start the development environment:
   ```bash
   docker-compose up --build
   ```
4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - PostgreSQL: db:5432

# Deployment stack

All hosted on Railway (https://railway.com/).

Never used it before, but sounded like a solid option for a small project.
They have a fairly generous free tier that has enough resources to run this simple app.
Documentation was also decent and deployment with docker was very quick.

Can be accessed here - https://frontend-production-25b6.up.railway.app/

# User stories that were implemented in the time I had:

1. I as a user can create to-do items, such as a grocery list (required)
2.  I as another user can collaborate in real-time with user - so that we can 
(for example) edit our family shopping-list together (required)
3. I as a user can mark to-do items as “done” - so that I can avoid clutter and focus on things that are still pending
4. I as a user can keep editing the list even when I lose internet connection, and can expect it to sync up with BE as I regain connection 
5. I as a user can change the order of tasks via drag & drop
6. I as a user can be sure that my todos will be persisted so that important information is not lost when server restarts
7. I as a user can can switch the themes between light and dark themes
8. I as a user can use the pin to highlight items that are more important
9. I as a user can remove the tasks so they dont clutter the list
10. I as a user can choose between creating two different types of todos - list with checkboxes and free type text with title and content
11. I as a user can use this on mobile phone

# Future improvements:
1. Improve drag and drop behaviour to be a bit less flaky
2. Improve the grid view to be more consitent with different size items
3. Create a custom url sharing functionality - got most of the way there, but didnt have time to fully finish
4. Clean the codebase up a bit more - split more in to reusable parts for easier maintenance
