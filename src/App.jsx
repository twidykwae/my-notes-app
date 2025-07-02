import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit3, Trash2, Save, X, Calendar } from 'lucide-react';

function App() {
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [note, setNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  const addNote = () => {
    if (note.trim() === '') return;

    if (isEditing) {
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = {
        ...updatedNotes[editIndex],
        text: note,
        updatedAt: new Date().toISOString()
      };
      setNotes(updatedNotes);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      const newNote = {
        id: Date.now(),
        text: note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes([newNote, ...notes]);
    }

    setNote('');
    inputRef.current?.focus();
  };

  const startEdit = (index) => {
    setNote(notes[index].text);
    setIsEditing(true);
    setEditIndex(index);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditIndex(null);
    setNote('');
    inputRef.current?.focus();
  };

  const deleteNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
    if (e.key === 'Escape' && isEditing) {
      cancelEdit();
    }
  };

  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Notes
          </h1>
          <p className="text-gray-600">Write your notes</p>
        </div>

        {/* Add/Edit Note Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="space-y-4">
            <div className="relative">
              <textarea
                ref={isEditing ? editInputRef : inputRef}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isEditing ? "Edit your note..." : "Write a new note..."}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                rows="3"
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              {isEditing ? (
                <>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={addNote}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={addNote}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus size={16} />
                  Add Note
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {notes.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12">
              {notes.length === 0 ? (
                <div className="text-gray-500">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-medium mb-2">No notes yet</h3>
                  <p>Start by adding your first note above!</p>
                </div>
              ) : (
                <div className="text-gray-500">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-medium mb-2">No matching notes</h3>
                  <p>Try adjusting your search terms</p>
                </div>
              )}
            </div>
          ) : (
            filteredNotes.map((noteItem, i) => {
              const originalIndex = notes.findIndex(n => n.id === noteItem.id);
              return (
                <div
                  key={noteItem.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 whitespace-pre-wrap break-words text-lg leading-relaxed">
                          {noteItem.text}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                          <Calendar size={14} />
                          <span>
                            {noteItem.updatedAt !== noteItem.createdAt 
                              ? `Updated ${formatDate(noteItem.updatedAt)}`
                              : `Created ${formatDate(noteItem.createdAt)}`
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(originalIndex)}
                          className="flex items-center gap-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNote(originalIndex)}
                          className="flex items-center gap-1 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stats Footer */}
        {notes.length > 0 && (
          <div className="text-center mt-8 text-gray-500 text-sm">
            {filteredNotes.length} of {notes.length} notes
          </div>
        )}
      </div>
    </div>
  );
}

export default App;