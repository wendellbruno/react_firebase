import { db, auth } from "../../firebaseConnection";
import { useState, useEffect } from "react";
import { doc, setDoc, collection, addDoc, getDoc, getDocs,
     updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth'
import './Index.css'

function Home(){

    const [titulo, setTitutlo] = useState('');
    const [autor, setAutor] = useState('')
    const [idPost, setIdPost] = useState('')

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('')

    const [user, setUser] = useState(false);
    const [userDetail, setUserDetail] = useState({})

    const [posts, setPosts] = useState([])


    useEffect(() =>{
        async function loadPosts(){
            const unsub = onSnapshot(collection(db, "posts"),(snapshot) =>{
                let listaPost = [];
                snapshot.forEach(elemento =>{
                listaPost.push({
                    id: elemento.id,
                    titulo: elemento.data().titulo,
                    autor: elemento.data().autor
                });
            });
            setPosts(listaPost)
            })
        }

        loadPosts()
    },[])

    useEffect(() =>{
        async function checkLogin(){
            onAuthStateChanged(auth, (user) =>{
                if(user){  
                    setUser(true)
                    setUserDetail({
                        uid: user.uid,
                        email: user.email
                    })
                }else{
                    setUser(false)
                    setUserDetail({})
                }
            })
        }

        checkLogin()
    },[])

    async function handleAdd(){
        /* implementa id na mão
        await setDoc(doc(db,"posts", "12345"),{
            titulo: titulo,
            autor: autor
        })
        .then(() =>{
            alert('Dados registrados')
        })
        .catch(erro => console.log(erro)) */

        await addDoc(collection(db, "posts"),{
            titulo: titulo,
            autor: autor
        }).then(() =>{
            setAutor('')
            setTitutlo('')
        })
        .catch(erro => console.log(erro))
    }

    async function buscarPost(){
        const postRef = doc(db, "posts", "12345")

        await getDoc(postRef)
        .then((snapshot) =>{
            setAutor(snapshot.data().autor)
            setTitutlo(snapshot.data().titulo)
        })
        .catch(() => console('erro ao buscar'))
    }

    


    async function buscarPosts(){
        const postsRef = collection(db, "posts")
        await getDocs(postsRef)
        .then((snapshot) =>{
            let lista = [];
            snapshot.forEach(elemento =>{
                lista.push({
                    id: elemento.id,
                    titulo: elemento.data().titulo,
                    autor: elemento.data().autor
                });
            });
            setPosts(lista)
        })
        .catch(erro => alert(erro))
    }


    async function editarPost(){
        const docRef = doc(db, "posts", idPost);
        await updateDoc(docRef,{
            titulo: titulo,
            autor: autor
        })
        .then(() =>{
            setAutor('')
            setIdPost('')
            setTitutlo('')
        })
        .catch(erro => alert(erro));
    }

    async function excluir(id){
        const docRef = doc(db, "posts", id);
        await deleteDoc(docRef)
        .then(() => alert('post deletado'))
        .catch(erro => alert(erro))
    }

    async function novoUsuario(email, senha){
        await createUserWithEmailAndPassword(auth, email, senha)
        .then(() =>{
            alert('Cadastrado com sucesso')
            setEmail('')
            setSenha('')
        })
        .catch(erro => alert(erro))
    }

    async function logarUsuario(email, senha){
        await signInWithEmailAndPassword(auth, email, senha)
        .then((value) =>{
            setUser(true);
            setUserDetail({
                uid: value.user.uid,
                email: value.user.email
            });
            setEmail('')
            setSenha('')
        }
        )
        .catch(erro => alert('Erro ao fazer login'))
    }

    async function deslogarUsuario(){
        await signOut(auth)
        .then(() => {
            setUser(false)
            setUserDetail({})
            alert('deslogado')
        })
        .catch(erro => alert(erro))
    }

    return(
        
        <div className="container">
            {
                user && (
                    <div>
                        <strong>Seja bem vindo você está logado</strong>
                        <span>ID: {userDetail.uid}</span>
                        <span>Email : {userDetail.email}</span>
                        <button onClick={deslogarUsuario}>Deslogar</button>
                    </div>
                )
            }
                <h2>Usuarios</h2>
                <div className="container">
                <label htmlFor="">Email</label>
                <input type="text" 
                onChange={e => setEmail(e.target.value)}
                value={email}
                placeholder="informe seu email"
                />
                <br />
                <label htmlFor="">Senha</label>
                <input type="text" 
                onChange={e => setSenha(e.target.value)}
                value={senha}
                placeholder="informe sua senha"
                />
                </div>
                <br />
                <button onClick={() => novoUsuario(email,senha)} > Cadastrar</button>
                <button onClick={() => logarUsuario(email,senha)} > Fazer Login</button>

            <br /><br />
            <hr />


            <label htmlFor="">Id: </label>
            <input 
            type="text"
            value={idPost}
            onChange={(e) => setIdPost(e.target.value)}
            />
            <label htmlFor="">Titulo :</label>
            <textarea 
            value={titulo}
            onChange={(e) => setTitutlo(e.target.value)}
            placeholder="Digite o titulo"></textarea>

            <label htmlFor="">Autor :</label>
            <textarea 
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            placeholder="Autor do post"></textarea>

            <button onClick={handleAdd}>Cadastrar</button>
            <button onClick={editarPost} >Atualizar post</button>
            <button onClick={buscarPosts}>Buscar Post</button>
            <ul>
                {
                    posts.map(elemento =>{
                        return(
                            <li key={elemento.id}>
                                <span>Id : {elemento.id}</span><br />
                                <span>Titulo : {elemento.titulo}</span> <br />
                                <span>autor : {elemento.autor}</span> <br /> <br />
                                <button onClick={() => excluir(elemento.id)}>Excluir</button>
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    )
}

export default Home;