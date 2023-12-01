# TechNest-Forum
Q&amp;A service for programmers | <b>[Demo Video](https://www.youtube.com/watch?v=X1nptFmwAeQ&ab_channel=AnnaM.)</b>

<img src="./usof-frontend/public/logo2.svg" width=340px />
<br/>
TechNest is a forum developed using React for the frontend and Express as a REST API on the backend. The project is a platform for sharing and discussing technology ideas, questions and news. Includes functionality to send API requests using Axios to interact with the MySQL database where the forum information is stored.

## Technology stack

#### Front-end

![React.js](https://img.shields.io/badge/-React.js-1e202a?style=for-the-badge&logo=react)
![Redux](https://img.shields.io/badge/-Redux-774abc?style=for-the-badge&logo=redux)
![React Router](https://img.shields.io/badge/-Router-E1D2D2?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iOTQiIGhlaWdodD0iNjEiIHZpZXdCb3g9IjAgMCA5NCA2MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcyLjczMTUgMjAuOTM1N0M3MC4wNTQ4IDIwLjA5NDEgNjguNjcyNSAyMC4zNzc4IDY1Ljg2NDkgMjAuMDcxQzYxLjUyNDYgMTkuNTk3NiA1OS43OTU0IDE3LjkwMTMgNTkuMDYxOSAxMy41MzU2QzU4LjY1MTQgMTEuMDk4NSA1OS4xMzYxIDcuNTMwMjIgNTguMDg4MSA1LjMyMTA2QzU2LjA4MzkgMS4xMDg3NSA1MS4zOTQzIC0wLjc4MDQzOSA0Ni42ODI4IDAuMjk3ODQzQzQyLjcwNDkgMS4yMDk1NiAzOS4zOTUxIDUuMTg1MTggMzkuMjExNyA5LjI2NkMzOS4wMDIxIDEzLjkyNTQgNDEuNjU3IDE3LjkwMSA0Ni4yMTU2IDE5LjI3M0M0OC4zODE0IDE5LjkyNjEgNTAuNjgyNSAyMC4yNTQ4IDUyLjk0NDQgMjAuNDIxNEM1Ny4wOTI1IDIwLjcyMzggNTcuNDExMyAyMy4wMjk3IDU4LjUzMzUgMjQuOTI3N0M1OS4yNDA5IDI2LjEyNDMgNTkuOTI2NCAyNy4zMDM0IDU5LjkyNjQgMzAuODcxNEM1OS45MjY0IDM0LjQzOTQgNTkuMjM2NSAzNS42MTg1IDU4LjUzMzUgMzYuODE1MUM1Ny40MTEzIDM4LjcwODcgNTYuMDI3MSAzOS45NDkxIDUxLjg3OSA0MC4yNTU5QzQ5LjYxNzEgNDAuNDIyNSA0Ny4zMTE2IDQwLjc1MTMgNDUuMTUwMiA0MS40MDQ0QzQwLjU5MTYgNDIuNzgwNyAzNy45MzY3IDQ2Ljc1MTkgMzguMTQ2MyA1MS40MTEzQzM4LjMyOTcgNTUuNDkyMSA0MS42Mzk1IDU5LjQ2NzggNDUuNjE3NCA2MC4zNzk1QzUwLjMyODkgNjEuNDYyMSA1NS4wMTg1IDU5LjU2ODYgNTcuMDIyNyA1NS4zNTYzQzU4LjA3NSA1My4xNDcxIDU4LjY1MTQgNTAuNjQ0MyA1OS4wNjE5IDQ4LjIwNzJDNTkuNzk5OCA0My44NDE0IDYxLjUyODkgNDIuMTQ1MSA2NS44NjQ5IDQxLjY3MTdDNjguNjcyNSA0MS4zNjQ5IDcxLjU3ODMgNDEuNjcxNyA3NC4yMDkzIDQwLjE3N0M3Ni45ODk1IDM4LjE0NTYgNzkuNDczNCAzNS4wOTY4IDc5LjQ3MzQgMzAuODcxNEM3OS40NzM0IDI2LjY0NTkgNzYuNzk2NyAyMi4yMTU2IDcyLjczMTUgMjAuOTM1N1oiIGZpbGw9IiNGNDQyNTAiLz4KPHBhdGggZD0iTTI4LjE5OTcgNDAuNzczOUMyMi43Mjg1IDQwLjc3MzkgMTguMjY1NiAzNi4zMDI3IDE4LjI2NTYgMzAuODIxM0MxOC4yNjU2IDI1LjMzOTkgMjIuNzI4NSAyMC44Njg3IDI4LjE5OTcgMjAuODY4N0MzMy42NzA5IDIwLjg2ODcgMzguMTMzOCAyNS4zMzk5IDM4LjEzMzggMzAuODIxM0MzOC4xMzM4IDM2LjI5ODMgMzMuNjY2NSA0MC43NzM5IDI4LjE5OTcgNDAuNzczOVoiIGZpbGw9IiMxMjEyMTIiLz4KPHBhdGggZD0iTTkuODk5IDYxQzQuNDM2NjEgNjAuOTg2OCAtMC4wMTMwOTM4IDU2LjQ5OCAyLjg5NTExZS0wNSA1MS4wMTIyQzAuMDEzMjA5OSA0NS41MzUzIDQuNDkzNiA0MS4wNzczIDkuOTY5MTQgNDEuMDk0OEMxNS40MzU5IDQxLjEwOCAxOS44ODU2IDQ1LjU5NjggMTkuODY4MSA1MS4wODI1QzE5Ljg1NDkgNTYuNTU1MSAxNS4zNzQ1IDYxLjAxMzEgOS44OTkgNjFaIiBmaWxsPSIjMTIxMjEyIi8+CjxwYXRoIGQ9Ik04My43MTM3IDYwLjk5OThDNzguMjMzOSA2MS4wMzA0IDczLjczNjEgNTYuNTkwMSA3My43MDUyIDUxLjEyMkM3My42NzQ3IDQ1LjYzMiA3OC4xMDY4IDQxLjEyNTggODMuNTY0NiA0MS4wOTQ5Qzg5LjA0NDQgNDEuMDY0MyA5My41NDIzIDQ1LjUwNDYgOTMuNTczMSA1MC45NzI3QzkzLjYwMzYgNTYuNDU4MyA4OS4xNzE2IDYwLjk2ODkgODMuNzEzNyA2MC45OTk4WiIgZmlsbD0iIzEyMTIxMiIvPgo8L3N2Zz4K)

#### Back-end

![Node.js](https://img.shields.io/badge/-Node.js-235656?style=for-the-badge&logo=javascript)
![Express.js](https://img.shields.io/badge/-Express.js-A4753F?style=for-the-badge&logo=express)
![MySQL](https://img.shields.io/badge/-MySQL-cccccc?style=for-the-badge&logo=mysql)

## Guidelines to setup

1. Open your local CLI:

   ```
   git clone https://github.com/xqudee/TechNest-Forum
   cd TechNest-Forum
   ```

2. Setup the backend code:
   
   - Go to the usof-backend directory & install the modules:

     ```
     cd usof-backend

     npm install
     ```

   - Install database:
  
     ```
     mysql -u root -p < db.sql
     ```
     
   - Run the server `npm start`.

3. Go to the root `usof-frontend` folder.
4. Setup the Frontend code -

   - Clone the code & install the modules:

     ```
     cd usof-frontend

     npm install
     ```

   - Run the client index `npm start`.

