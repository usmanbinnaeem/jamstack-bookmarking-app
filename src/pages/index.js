import React from "react"
import FormField from "../components/FormField"
import BookMarkList from "../components/BookMarkList"

export default function Home() {
  return (
    <div>
      <div style = {{textAlign: 'center'}}>
        <h1>JamStack Bookmark App</h1>
      </div>
      <FormField />
      <BookMarkList />
    </div>
  )
}
