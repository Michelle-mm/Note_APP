import React, {useState, useEffect} from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
// import { nanoid } from "nanoid"
import {noteCollection, db} from "./firebase.js";
import {onSnapshot, addDoc, deleteDoc, setDoc , doc} from "firebase/firestore";

export default function App() {
    const [notes, setNotes] = useState([]);
    const [currentNoteId, setCurrentNoteId] = useState("");
    const [tempNoteText, setTempNoteText] = useState("");

    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    const sortedNotesArr = notes.sort(function(a, b){  
        return b.updatedAt - a.updatedAt;
    }); 

    React.useEffect(()=>{
        if (currentNote){
            setTempNoteText(currentNote.body.slice());
        } 
    }, [currentNote])

    // console.log(`temp: ${tempNoteText}`)
    
    //debouncing 
    React.useEffect(()=>{
        const timer = setTimeout(()=>{
            if(tempNoteText != currentNote.body){
                updateNote(tempNoteText);
            }
        }, 500);
        return ()=> clearTimeout(timer);
    }, [tempNoteText])
    
    useEffect(() => {
        const unsubscribe = onSnapshot(noteCollection, function(snapshot){
            const noteArrs = snapshot.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id
            }))
            
            setNotes(noteArrs);
        })
        return unsubscribe;
    }, [])

    useEffect(()=>{
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id);
        }
    }, [notes])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        /* don't need to update notes manually setNotes(prevNotes => [newNote, ...prevNotes])
        snapshot takes care of setting the note array
        Here just to push up the new document up to firestore */
        const newNoteRef = await addDoc(noteCollection, newNote);
        setCurrentNoteId(newNoteRef.id)
    }

    function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId);
        setDoc(docRef, {body: text, updatedAt: Date.now()}, {merge: true});
    }

    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId);
        await deleteDoc(docRef);
    }

    return (
        <main>
         {
            notes.length > 0
                ?
                <Split
                    sizes={[30, 70]}
                    direction="horizontal"
                    className="split"
                >
                    <Sidebar
                        notes={notes}
                        currentNote={currentNote}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                        deleteNote={deleteNote}
                    />
                
                    <Editor
                        tempNoteText={tempNoteText}
                        setTempNoteText={setTempNoteText}
                    />
                
                </Split>
                :
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button
                        className="first-note"
                        onClick={createNewNote}
                    >
                        Create one now
            </button>
                </div>
        } 
            
        </main>
    )
}

