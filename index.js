import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

/* document.addEventListener('click', function(e){
    console.log(e.target)
})  */

let lastClickedTweetUuid = ''
let index = 0

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === 'btn-icon' || e.target.className === 'fa-solid fa-xmark'){
        handleCloseBtnClick()
    }
    //reveal replies on click anywhere on the tweet
    else if(e.target.className === 'tweet-inner' || e.target.className === 'tweet' || e.target.className === 'tweet-text' || e.target.className === 'handle' || e.target.className === 'profile-pic' || e.target.className === 'delete-icon-div'){
        handleReplyReveal(e.target.dataset.replyreveal)
    }
    else if(e.target.id == 'btn-answer'){
        handleAnswerBtnClick()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    updateLocalStorage() // update the LocalStorage because data (liked) is changed
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    updateLocalStorage() // update the LocalStorage because data (retweet) is changed
    render() 
}

function handleReplyClick(replyId){

    lastClickedTweetUuid = replyId

    //get index position
    tweetsData.forEach(function(tweet){
        if(tweet.uuid === replyId){
            index = tweetsData.indexOf(tweet); //get index position of tweet
        }
    });

    document.querySelector('.modal').classList.toggle('hidden'); //show modal

    let tweetHandle = ''
    tweetsData.forEach(function(tweet){ //get tweet handle
        if(replyId === tweet.uuid){
            tweetHandle = tweet.handle
        }
    })

    document.getElementById('answer-tweet').textContent = `Answer tweet ${tweetHandle}` // update h2 with tweet handle
    //document.getElementById(`replies-${replyId}`).classList.toggle('hidden'); // old
}

function handleReplyReveal(replyId){ //reveal the replies
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden');
}

function handleCloseBtnClick(){ //close the modal
    document.querySelector('.modal').classList.toggle('hidden');
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Nils`,
            profilePic: `images/nils.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
            isOwn: true
        })
    updateLocalStorage() // update the LocalStorage because new Tweet Available
    render()
    tweetInput.value = ''
    }

}

function handleAnswerBtnClick(){

    const answerInput = document.getElementById('answer-input')

    // index of tweet (uuid)
    

    if(answerInput.value){
        tweetsData[index].replies.unshift({
            handle: `@Nils  `,
            profilePic: `images/nils.jpg`,
            tweetText: answerInput.value
        })
        //console.log(answerInput.value)
    }
    updateLocalStorage()
    render()
    handleReplyReveal(lastClickedTweetUuid)
    handleCloseBtnClick()
    //document.querySelector('.modal').classList.toggle('hidden');
}

function handleDeleteClick(tweetId){ //delete a tweet
    tweetsData.forEach(function(tweet){
        if(tweet.uuid === tweetId){
            const index = tweetsData.indexOf(tweet); //get index position of tweet
            tweetsData.splice(index, 1) //delete one tweet at index position
            updateLocalStorage()
            render()
        } 
    })
}


function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
        let deleteIconClass = ''
        //check if tweetsdata if tweet is own and display or hide delete button
        if(!tweet.isOwn){
            deleteIconClass = 'hidden'
        }

        feedHtml += `
<div class="tweet" data-replyreveal="${tweet.uuid}">
    <div class="tweet-inner" data-replyreveal="${tweet.uuid}">
        <img src="${tweet.profilePic}" class="profile-pic" data-replyreveal="${tweet.uuid}">
        <div class="delete-icon-div" data-replyreveal="${tweet.uuid}">
            <div id="deleteIconDiv" class="delete-icon-div" data-replyreveal="${tweet.uuid}">
                <p class="handle" data-replyreveal="${tweet.uuid}">${tweet.handle}</p>
                <div class="${deleteIconClass}">
                    <i class="fa-solid fa-trash"
                    data-delete="${tweet.uuid}"
                    ></i>
                </div>
            </div>
            <p class="tweet-text" data-replyreveal="${tweet.uuid}">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

// update local storage data
function updateLocalStorage(){
    let dataStr = JSON.stringify(tweetsData) // tweetsdata is stringified
    localStorage.setItem("tweetsData", dataStr) // new data is added to the localStorage
}

function render(){
    //Check if local storage is filled and add it to tweetsData
    if(localStorage.key(0)){
        // empty the existing tweetsData Array
        tweetsData.splice(0, tweetsData.length)
        // push objects into tweetsData Array from local Storage
        let str = localStorage.getItem("tweetsData"); //get localStorage Data as String
        let objArr = JSON.parse(str) // turn localStorage Data into Array
        objArr.forEach(function(tweet){ // Loop through Array and add each "item/tweet" to tweetsData
            tweetsData.push(tweet)
        })
    }
    //render HTML
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

