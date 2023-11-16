import { signInWithEmailAndPassword, auth, signOut } from './firebase.js';

console.log("Main.js cargado");
// Verificando la existencia de los botones antes de agregar eventos
const signOutBtnElem = document.getElementById('signOutBtn');
if (signOutBtnElem) {
    signOutBtnElem.addEventListener('click', signOut);
}

const signInBtnElem = document.getElementById('signInBtn');
if (signInBtnElem) {
    signInBtnElem.addEventListener('click', () => {
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;
        signInWithEmailAndPassword(email, password);
    });
}

console.log("Verificando usuario...");

auth.onAuthStateChanged((user) => {
    console.log("Callback de onAuthStateChanged ejecutado", user);
    console.log("Verificando usuario en sistem.html");

    const userInfoElem = document.getElementById('userInfo');
    const redirectToOtherHtmlElem = document.getElementById('redirectToOtherHtml');
    console.log("Callback de onAuthStateChanged ejecutado", user);
    updateUserInterface(user);  // Llama a la función aquí
    if (user) {
        console.log("Usuario detectado:", user.email);
        if (userInfoElem) userInfoElem.textContent = user.email;
        if (signInBtnElem) signInBtnElem.style.display = 'none';
        if (signOutBtnElem) signOutBtnElem.style.display = 'block';
        if (redirectToOtherHtmlElem) redirectToOtherHtmlElem.style.display = 'block';
        loadPosts();
    } else {
        console.log("Usuario no detectado");
        if (userInfoElem) userInfoElem.textContent = '';
        if (signInBtnElem) signInBtnElem.style.display = 'block';
        if (signOutBtnElem) signOutBtnElem.style.display = 'none';
        if (redirectToOtherHtmlElem) redirectToOtherHtmlElem.style.display = 'none';
        loadPosts();
    }
});

function updateUserInterface(user) {
    const userInfoElem = document.getElementById('userInfo');
    const signInFormElem = document.getElementById('signInForm');

    if (user) {  // Si el usuario está autenticado
        if (userInfoElem) userInfoElem.textContent = user.email;
        if (signInFormElem) signInFormElem.style.display = 'none';
    } else {  // Si el usuario no está autenticado
        if (userInfoElem) userInfoElem.textContent = '';
        if (signInFormElem) signInFormElem.style.display = 'block';
    }
}


// Lógica para manejar el formulario
const signInFormElem = document.getElementById('signInForm');
if (signInFormElem) {
    signInFormElem.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.elements['email'].value;
        const password = e.target.elements['password'].value;

        if (email && password) {
            const user = {
                email: email,
            };
            updateUserInterface(user);
        } else {
            alert("Por favor, ingresa un email y una contraseña.");
        }
    });
}

// Función para cargar y mostrar publicaciones
function loadPosts() {
    fetch('http://localhost:3000/api/posts')
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';
        // postsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        posts.forEach(post => {
            const postElem = document.createElement('div');
            postElem.classList.add('post');
            postElem.innerHTML = `
            <div class="card">
                <div class="card-image"><img src="${post.imagen}" alt="Imagen del post" width="320px" height="320px" style="object-fit: cover;"  data-imagen="${post.imagen}"></div>
                <div class="category"> <p data-tipo="${post.tipo}">${post.tipo}</p> <small data-fecha="${new Date(post.fecha).toLocaleDateString()}">${new Date(post.fecha).toLocaleDateString()}</small></div>
                <div class="heading"><h2 data-titulo="${post.titulo}">${post.titulo}</h2>
                    <div class="author"> <p data-cuerpo="${post.cuerpo}">${post.cuerpo}</p></div>
                    <button class="deletePostBtn" onclick="openDeleteModal(${post.id})">Eliminar</button>
                    <button class="editPostBtn" data-id="${post.id}">Editar</button>
                </div>
            </div>
                
            `;
            postsContainer.appendChild(postElem);
        });
    })
    .catch(error => {
        console.error('Error cargando las publicaciones:', error);
    });
}

// esto de aca es lo del modal:
const modal = document.getElementById('createPostModal');
const closeBtn = document.querySelector('.close-btn');
const createPostBtn = document.getElementById('createPostBtn');

// Mostrar modal
document.getElementById('newPostBtn').onclick = function() {
    modal.style.display = "block";
  }
  
  // Cerrar modal
  closeBtn.onclick = function() {
    modal.style.display = "none";
  }
  
  // Enviar datos del post
  createPostBtn.onclick = function() {
    // Capturar los valores de los inputs
    const titulo = document.getElementById('titulo').value;
    const cuerpo = document.getElementById('cuerpo').value;
    const tipo = document.getElementById('tipo').value;
    const fecha = document.getElementById('fecha').value;
    const imagen = document.getElementById('imagen').files[0]; // Obtener el archivo
  
    // Crear un objeto FormData
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('cuerpo', cuerpo);
    formData.append('tipo', tipo);
    formData.append('fecha', fecha);
    formData.append('imagen', imagen);
  
    // Envía los datos usando fetch
    fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        body: formData,  // No es necesario definir headers específicos para FormData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Post creado:', data);
        modal.style.display = "none"; // Cierra el modal después de enviar
        loadPosts(); // Recarga la lista de posts
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    }

    // Lógica del modal de eliminación
    const deletePostModal = document.getElementById('deletePostModal');
    const closeBtnDelete = document.querySelector('.close-btn-delete');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    let postIdToDelete = null;

    window.openDeleteModal = openDeleteModal;
    window.closeDeleteModal = closeDeleteModal;

    function openDeleteModal(postId) {
        postIdToDelete = postId;
        deletePostModal.style.display = "block";
    }

    function closeDeleteModal() {
        postIdToDelete = null;
        deletePostModal.style.display = "none";
    }

    closeBtnDelete.onclick = closeDeleteModal;

    confirmDeleteBtn.onclick = function() {
        if (postIdToDelete) {
            fetch(`http://localhost:3000/api/posts/${postIdToDelete}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(() => {
                closeDeleteModal();
                loadPosts();
            })
            .catch(error => {
                console.error('Error eliminando la publicación:', error);
            });
        }
    }


    //modal editar:
    // Referencias para el modal de edición
    const editModal = document.getElementById('editPostModal');
    const closeEditBtn = document.querySelector('.close-btn-edit');
    const updatePostBtn = document.getElementById('updatePostBtn');
    let currentEditingPostId = null;

    // Abrir modal de edición
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('editPostBtn')) {
            currentEditingPostId = e.target.getAttribute('data-id');
            
            // Aquí puedes cargar los valores actuales de la publicación en los campos del modal
            const postElem = e.target.closest('.post'); // asumiendo que el botón está directamente dentro del div de la publicación
            const titulo = postElem.querySelector('[data-titulo]').getAttribute('data-titulo');
            const cuerpo = postElem.querySelector('[data-cuerpo]').getAttribute('data-cuerpo');
            
            document.getElementById('editTitulo').value = titulo;
            document.getElementById('editCuerpo').value = cuerpo;
            editModal.style.display = "block";
        }
    });

    // Cerrar modal de edición
    closeEditBtn.onclick = function() {
        editModal.style.display = "none";
    }

    // Actualizar post
    updatePostBtn.onclick = function() {
        const titulo = document.getElementById('editTitulo').value;
        const cuerpo = document.getElementById('editCuerpo').value;
        const tipo = document.getElementById('editTipo').value; // Asegúrate de que este campo existe en tu modal
        const fecha = document.getElementById('editFecha').value; // Asegúrate de que este campo existe en tu modal
        const imagen = document.getElementById('editImagen').files[0];

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('cuerpo', cuerpo);
        formData.append('tipo', tipo);
        formData.append('fecha', fecha);
        formData.append('imagen', imagen);

        console.log({ titulo, cuerpo, tipo, fecha });

        fetch(`http://localhost:3000/api/posts/${currentEditingPostId}`, {
            method: 'PUT',
            body: formData
        })
        .then(response => {
            if (response.headers.get('content-type').includes('application/json')) {
                return response.json();
            } else {
                return response.text();
            }
        })
        .then(data => {
            console.log('Post actualizado:', data);
            editModal.style.display = "none";
            loadPosts();
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    }

//PATCH CODIGO
updateTitleBtn.onclick = function() {
    const titulo = document.getElementById('editTitulo').value;

    const data = {
        titulo: titulo
    };

    fetch(`http://localhost:3000/api/posts/${currentEditingPostId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        } else if (data.error) {
            alert(data.error);
        }
        editModal.style.display = "none";
        loadPosts();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al actualizar el post.');
    });
};


// Al cargar la página, asumiremos que no hay un usuario autenticado.
updateUserInterface(null);
