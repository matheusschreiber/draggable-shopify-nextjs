import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { useEffect, useState } from 'react'

export default function Home() {
  
  const [ items, setItems ] = useState(['⚡️','⚡️','⚡️','⚡️','⚡️','⚡️'])
  const [ source, setSource ] = useState("Start")
  const [ placed, setPlaced ] = useState("End")
  const [ draggableState, setDraggableState ] = useState(0);

  function checkMatch(start, end, draggable){   
    let fases = ['⚡️','🎨','🔥','🐛','🚑️','✨']

    console.log(start.id + ' -> ' + end.id)
    
    let array = items.slice()
    if (start.innerHTML==end.innerHTML) {
      // array.splice(array.indexOf(start),1)
      array[start.id]=' '
      fases.map((i,pos)=>{
        if (i==start.innerHTML && pos+1!==fases.length) array[end.id] = fases[pos+1]
      })
    } else if (end.innerHTML===' ') {
      array[start.id]=' '
      array[end.id]=start.innerHTML
    }
    draggable.destroy()
    setItems(array)
  }

  function addItem(){
    let array = items.slice();
    array[array.indexOf(' ')] = '⚡️'
    setItems(array)
  }
  
  async function loadDrag(){
    const {
      Draggable,
    } = await import(/* webpackChunkName: "user-defined" */'@shopify/draggable')

    if (draggableState) draggableState.destroy()

    const containers = document.querySelectorAll('ul');

    if (containers.length === 0) {
      return false;
    }

    console.log('Loading with: ' + items)

    const draggable = new Draggable(containers, {
      draggable: 'li',
      mirror: {
        constrainDimensions: true,
      },
    });

    draggable.on("drag:move", () => {
      let element = document.getElementsByClassName('draggable-source--is-dragging')[0]
      element.style.visibility = 'hidden';   
      setSource(element.innerHTML)
    });

    draggable.on("drag:over", ()=>{
      let element = document.getElementsByClassName('draggable--over')[0]
      setPlaced(element.innerHTML)
    })

    draggable.on("drag:stop", () => {
      let start = document.getElementsByClassName('draggable-source--is-dragging')[0]
      let end = document.getElementsByClassName('draggable--over')[0]

      if (!start || !end) return


      checkMatch(start, end, draggable)
    })

    setDraggableState(draggable)
  }

  useEffect(()=>{   
    // if (typeof(window)!=="undefined") window.addEventListener('load', loadDrag);
  })

  useEffect(()=>{
    loadDrag()
  }, [items])

  return (
    <div className={styles.container}>
      <Head>
        <title>Drag and Drop - playground</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={()=>addItem()} style={{width:'100px', height:'100px', margin:'10px auto'}}>new</button>
      <main className={styles.main}>
        <ul>
          {
            items.map((i,pos)=>(
              <li key={i + pos} id={pos}>{i}</li>
            ))
          }
        </ul>
      </main>
    </div>
  )
}
