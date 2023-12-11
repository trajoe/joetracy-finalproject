function createElemWithText(elementName='p', textContent="", className=""){
    const element = document.createElement(elementName);
   
    if(textContent !== ""){
    element.textContent = textContent;
   }

   if(className !== ""){
    element.className = className;
   }
   return element;
}



function createSelectOptions(usersData){
    if(!usersData){
        
        return undefined;
    }

    const options = [];

    usersData.forEach(user=>{
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        options.push(option);
    });
    return options;
    }




function toggleCommentSection(postId){
if(!postId){
    return undefined;
}

if (!postId || isNaN(postId)){
    return null
}

const section = document.querySelector(`section[data-post-id="${postId}"]`);
if(section){
    section.classList.toggle('hide');
} else {
    const newSection = document.createElement('section');
    newSection.setAttribute('data-post-id', postId);
    newSection.textContent = `Comments for Post ${postId}`;
    document.body.appendChild(newSection);
}

return section;
}


function toggleCommentButton(postId){
   if(!postId){
    return undefined;
   }
   
   
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
if(button){
    button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';

    return button;
} else {
    return null;
    }
}

function deleteChildElements(parentElement){
    if(!(parentElement instanceof Element)){
        return undefined;
    }
    
    let child = parentElement.lastElementChild;

    while(child){
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}


function addButtonListeners(){
    const buttons = document.querySelectorAll('main button');

    if(buttons.length > 0){
        buttons.forEach(button => {
            const postId = button.dataset.postId;

            if(postId) {
                button.addEventListener('click',function (event){
                    toggleComments(event, postId);
                });
            }
        });
        return buttons;
    } else {
        return document.querySelectorAll('main button');
    }
}
function toggleComments(event,postId){
    if(!event || !postId){
        return undefined;
    }
    event.target.listener = true

    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    return [section,button];


}

function removeButtonListeners(){
    const buttons = document.querySelectorAll('main button');

    if (buttons.length > 0){
        buttons.forEach(button => {
            const postId = button.dataset.id;

    if(postId){
        button.removeEventListener('click', function(event){
                toggleComments(event,postId);
        });
    }
        });
    return buttons;

    }else {
        return document.querySelectorAll('main button');
    }
}
    
function createComments(commentsData){
    if(!commentsData || !Array.isArray(commentsData) || commentsData.length ===0){
        return undefined;
}
const fragment = document.createDocumentFragment();
commentsData.forEach(comment => {
    const article = document.createElement('article');

    const h3 = createElemWithText('h3', comment.name);

    const bodyParagraph = createElemWithText('p',comment.body);

    const emailParagraph = createElemWithText('p', `From: ${comment.email}`);

    article.appendChild(h3);
    article.appendChild(bodyParagraph);
    article.appendChild(emailParagraph);

    fragment.appendChild(article);
    });

    return fragment;
}

function populateSelectMenu(usersData){
    if(!usersData || !Array.isArray(usersData) || usersData.length ===0){
        return undefined;
    }

    const selectMenu = document.getElementById('selectMenu');

    const options = createSelectOptions(usersData);

    options.forEach(option => {
        selectMenu.appendChild(option);

    });

    return selectMenu;
}

async function getUsers() {
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if(!response.ok){
            throw new Error('error fetching users')
        }

return await response.json();
    }   catch (error){
        return undefined;
    }

}

async function getUserPosts(userId){
    if(!userId){
        return undefined;
    }
    
    
    try{
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
        if(!response.ok){
            throw new Error('error fetching posts for user');
        }


        const posts = await response.json();
        return posts;
    } catch (error){
        console.error('Error in getUserPosts', error.message);
       return undefined;
    }
}

async function getUser(userId){
    if(!userId){
        return undefined;
    }

try{
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    if(!response.ok){
        throw new Error('Error fetching user data');
    }
    return await response.json();
} catch (error){
    console.error('Error in getUser:'.error.message);
    return undefined;
    }

}

async function getPostComments(postId){
    if(!postId){
        return undefined;
    }

try{
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    if(!response.ok){
        throw new Error('Error fetching comments for post');
    }
    return await response.json();
} catch (error) {
    console.error('Error in getPostComments:', error.message);

    }   
}

async function displayComments(postId){
    if(!postId){
        return undefined;
    }

    const section = document.createElement('section');

    section.dataset.postId = postId;

    section.classList.add('comments', 'hide');

    try{
        const comments = await getPostComments(postId);

        if(comments){
            const fragment = createComments(comments);

            section.appendChild(fragment);
        }
    } catch (error){
        return undefined;
    }
    return section;
}

async function createPosts(postsData){
    if(!postsData || !Array.isArray(postsData) || postsData.length === 0){
        return undefined;
    }
    const fragment = document.createDocumentFragment();

    for (const post of postsData){
        const article = document.createElement('article');


        const h2 = createElemWithText('h2', post.title);
        article.appendChild(h2);


        const bodyParagraph = createElemWithText('p', post.body);
        article.appendChild(bodyParagraph);


        const postIdParagraph = createElemWithText('p', `Post ID: ${post.id}`);
        article.appendChild(postIdParagraph);

        try {
            const author = await getUser(post.userId);

            const authorParagraph = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
            article.appendChild(authorParagraph);


            const catchphraseParagraph = createElemWithText('p', `Multi-layered client-server neural-net`);
            article.appendChild(catchphraseParagraph);
           
            const button = document.createElement('button');

           button.textContent = 'Show Comments';

           button.dataset.postId = post.id;
           article.appendChild(button);
            const section = await displayComments(post.id);
            article.appendChild(section);
           
        } catch (error) {
            return undefined
        }
        fragment.appendChild(article);
    }
        return fragment;
}

async function displayPosts(postsData){
    const mainElement = document.querySelector('main');
    
    const element = postsData && postsData.length > 0
    ? await createPosts(postsData)
    : createElemWithText('p','Select an Employee to display their posts.', 'default-text');

    mainElement.appendChild(element);

    return element;
}

async function refreshPosts(postsData){
    if(!postsData){
        return undefined;
    }
    
    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector('main'));
    const fragment = await displayPosts(postsData);
    const addButtons = addButtonListeners();

    return [removeButtons, main, fragment, addButtons];
}



async function selectMenuChangeEventHandler(event){
    
    if(!event) {
        return undefined;
    }

    if(!event.target){
        return [1, [], []];
    }


    try{
    const selectMenu = document.getElementById('selectMenu');
    selectMenu.disabled = true;

        const userId = event.target.value || 1;

        const posts = await getUserPosts(userId);
        
        const refreshPostsArray = await refreshPosts(posts);

        selectMenu.disabled= false;

        return [userId, posts, refreshPostsArray];

    }catch (error){
        console.error(error);
        const selectMenu = document.getElementById('selectMenu');
        if(selectMenu)
       selectMenu.disabled= false;
    }
        return [undefined,[],[]];
}



async function initPage(){
    try{
        const users = await getUsers();
        const select = populateSelectMenu(users);
        return [users, select];
    
    } catch (error){
        console.error(error);
        return [];
    }
}

async function initApp(){
    await initPage();

    const selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change',selectMenuChangeEventHandler);


}

document.addEventListener('DOMContentLoaded',initApp);

