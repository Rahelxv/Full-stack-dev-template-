import Main from "./components/Main.jsx";
import { useState, useEffect } from "react";
function App() {
  const [post, setPost] = useState([]);
  const [formPost, setFormPost] = useState(false);
  //EDITED
  const [editAktif, setEditAktif] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);

  const handleToggleInput = () => {
    setFormPost((prev) => !prev);
    setEditAktif(false);
    setCurrentEdit(null);
  };

  //geting post data (GET)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/posts", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        setPost(result);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData(); //calling the function
  }, []);

  //Posting the post (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target; //ambil data dari target dari fungs ini
    const formData = new FormData(form); //iterate semua value yang ada nama biar bisa ambil data dari form pakai ini
    const data = Object.fromEntries(formData.entries()); //ubah data yang diambil jadi key value pari
    data.published = true;
    try {
      const response = await fetch("http://127.0.0.1:8000/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // WAJIB ADA
        },
        body: JSON.stringify(data), //ubah data jadi format json biar bisa dikirim
      });

      if (response.ok) {
        const result = await response.json();
        setFormPost(false);
        setPost((prev) => [result.data, ...prev]);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  //deleted id
  const handleDeleted = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/posts/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPost((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  //handle edit
  const handelEdit = (id) => {
    setEditAktif(true);
    setFormPost(true);
    const dataWantToEdit = post.find((item) => item.id == id);
    setCurrentEdit(dataWantToEdit);
  };
  //real edit
  const editSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.published = true;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/posts/${currentEdit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // WAJIB ADA
          },
          body: JSON.stringify(data), //ubah data jadi format json biar bisa dikirim
        },
      );

      if (response.ok) {
        const result = await response.json();
        setFormPost(false);
        setEditAktif(false);
        setPost((prev) =>
          prev.map((item) => (item.id === currentEdit.id ? result.data : item)),
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <>
      {/* Open form for Posting toggle */}
      <div className="flex justify-center my-14">
        <button
          onClick={handleToggleInput}
          className="cursor-pointer active:translate-y-0.5"
        >
          <img className="w-14" src="image.png" alt="" />
        </button>
      </div>
      {formPost ? (
        <form
          onSubmit={editAktif ? editSubmit : handleSubmit}
          className="flex flex-col items-center gap-4 mb-4"
        >
          <input
            className="border border-black pl-2 rounded-l"
            type="text"
            name="title"
            placeholder="TITLE"
            defaultValue={editAktif ? currentEdit.title : ""}
            required
          />
          <input
            className="border border-black pl-2 rounded-l"
            type="text"
            name="content"
            placeholder="CONTENT"
            defaultValue={editAktif ? currentEdit.content : ""}
            required
          />
          <button className="w-32 h-8 bg-black rounded-xl text-white">
            {editAktif ? "Edit" : "Post"}
          </button>
        </form>
      ) : null}
      <Main post={post} onDeleted={handleDeleted} onEdited={handelEdit} />
    </>
  );
}

export default App;
