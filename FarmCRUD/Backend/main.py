from fastapi import FastAPI, Response, status, HTTPException # ibarat express
from fastapi.params import Body  # ibarat body-parser
from pydantic import BaseModel  # for validation and sanitaion res req data
import psycopg2
from psycopg2.extras import RealDictCursor
import time
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#CORS (Cross-Origin Resource Sharing)
origins = [
    "http://localhost:5173", # Port default React
    "http://127.0.0.1:8000",
    # Tambahkan URL production nanti di sini
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # Izinkan list origins di atas
    allow_credentials=True,
    allow_methods=["*"],             # Izinkan semua method (GET, POST, PUT, DELETE, dll)
    allow_headers=["*"],             # Izinkan semua header
)



#db connection
while True:
    try:
        conn = psycopg2.connect(host ='localhost', database='FastAPI', user='postgres', password='Rahelxv', cursor_factory=RealDictCursor)
        cursor = conn.cursor()
        print("Connection to Database success")
        break
    except Exception as error:
        print("db connection failed")
        print("Error: ", error)
        time.sleep(2) #wait for sometime to try again

# path operation / route
@app.get("/")
def root():
    return {"message": "bellow World"}

#getting all post
@app.get("/posts")
def get_posts():
    cursor.execute("SELECT * FROM posts")
    posts = cursor.fetchall()
    return posts

# Input Sanitization dan Schema Validation
class Post(BaseModel):
    title: str
    content: str
    published: bool


#posting a post 
@app.post("/posts", status_code=status.HTTP_201_CREATED)
def create_post(Posting: Post):
    cursor.execute("INSERT INTO posts (title, content, published) VALUES (%s, %s, %s) RETURNING *", 
                   (Posting.title, Posting.content, Posting.published))
    new_post = cursor.fetchone() #fetching only one
    conn.commit() #commiting to write in database (without this, it doent automaticly commit/write it)
    return {"data": new_post}            

#get latest post
@app.get("/posts/latest")
def get_latest_post():
    post = my_posts[-1]
    return post


#get certain id post
@app.get("/posts/{id}")
def get_post(id, response: Response):
    cursor.execute("SELECT * FROM posts WHERE id = %s", [id])
    get_post = cursor.fetchone()
    if not get_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id: {id} was not found")
    return get_post

#deleating a post
@app.delete("/posts/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(id: int):
    cursor.execute("DELETE FROM posts WHERE id = %s returning *", [id])
    deleted_post = cursor.fetchone()
    conn.commit() #commiting deleted for real
    if deleted_post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id: {id} does not exist")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

#Update posts
@app.put("/posts/{id}")
def update_post(id: int, post: Post):
    cursor.execute("UPDATE posts SET title = %s, content = %s, published = %s WHERE id = %s RETURNING *", [post.title, post.content, post.published, id])
    update_post = cursor.fetchone()
    conn.commit()
    if update_post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"post with id: {id} does not exist")
    return {"data" : update_post}

