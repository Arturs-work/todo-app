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

Can be accessed here - https://todo-25b6.up.railway.app/ef6226ca-2d40-4901-bbc1-8db9ef827643

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
12. As a user I can create multiple boards and share it with someone using unique link. Users with the same link will see the real-time updates only on the board they are on.

# Future improvements:
1. Expand the task creation functionality to allow adding sub tasks
2. Add a search functionality and with ability to order by certain criteria
3. Adding an indicator to see when someone else is editing the task so users can coloborate more effectively
