import { useState, useEffect } from 'react';

function App() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const addNote = () => {
    if (note.trim() === '') return;
    setNotes([...notes, note]);
    setNote('');
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Notes App</h1>

      <div className="max-w-xl mx-auto">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a note..."
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={addNote}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
  {notes.map((n, i) => (
    <li
      key={i}
      className="bg-white p-3 rounded shadow text-gray-800 flex justify-between items-center"
    >
      <span>{n}</span>
      <button
        onClick={() => {
          const updatedNotes = [...notes];
          updatedNotes.splice(i, 1);
          setNotes(updatedNotes);
        }}
        className="text-red-500 hover:text-red-700 font-semibold"
      >
        Delete
      </button>
    </li>
  ))}
</ul>

      </div>
    </div>
  );
}

export default App
