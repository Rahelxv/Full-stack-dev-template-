export default function Main(props) {
  let item = props.post;
  //deleted post (DELETE)

  return (
    <div className="flex flex-col items-center gap-4">
      {item.map((x) => (
        <div
          className="flex justify-between w-92 h-20 border border-black p-2"
          key={x.id}
        >
          <div>
            <p>{x.title}</p>
            <p>{x.content}</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => props.onDeleted(x.id)}
              className="cursor-pointer active:translate-y-0.5"
            >
              <img
                className="w-6"
                src="delete_button.png"
                alt="delete button image"
              />
            </button>
            <button
              onClick={() => props.onEdited(x.id)}
              className="cursor-pointer active:translate-y-0.5"
            >
              <img
                className="w-6"
                src="edited_button.png"
                alt="edited button"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
