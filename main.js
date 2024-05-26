const submit_prompticon = document.getElementById("submit_prompticon");
const chat_input_textarea_prompt = document.getElementById("chat_input_textarea_prompt");
const chats_container = document.querySelector(".chats_container");
let usertext = null;

const get_chat_response = async (usertext) => {
    const openai_api_key = `api key`;
    const openai_api_url = `api url`;
    
    const networkrequest_options = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${openai_api_key}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            prompt: usertext,
            temperature: 0.2,
            max_tokens: 2048,
            // "Retry-After": 3600,
            // n: 1,
            // stop: null,
        })
    }
    try {
        const openai_api_json_response = await fetch(openai_api_url, networkrequest_options);
        // if(!openai_api_json_response.ok) {
        //     throw new Error("network request was not successful");
        // }
        const response_data = await openai_api_json_response.json();
        console.log(response_data);
        return response_data.choices[0].message.content;
    }
    catch(error) {
        console.log(error);
        // return null;
    }
}

const show_api_response_typing_animation = async () => {
    const typing_animation_chat_structure = `<div class="chat_maincontentbox">
    <div class="chat_profile">
        <img src="images/chatgpticon.svg" alt="chatgpt profile pic" class="userprofilepic">
        <h4 class="chat_username_title">ChatGPT</h4>
    </div>
    <div class="chat_contentbox">
        <div class="apiresponse_typing_animation">
            <div class="apiresponse_typingdot" style="--animationdelay: 0.2s;"></div>
            <div class="apiresponse_typingdot" style="--animationdelay: 0.3s;"></div>
            <div class="apiresponse_typingdot" style="--animationdelay: 0.4s;"></div>
        </div>
    </div>
    <div class="edit_icondiv">
        <i class="fa-solid fa-copy"></i>
        <i class="fa-solid fa-thumbs-down"></i>
    </div>
</div>`;
const typing_animation_chatdiv = create_outgoing_incoming_chat_elements(typing_animation_chat_structure, "incoming_chats");
// =================================================== api response animation ===================================================
chats_container.appendChild(typing_animation_chatdiv);
const show_apiresponse = await get_chat_response(usertext);
const chat_contentbox = typing_animation_chatdiv.querySelector(".chat_contentbox");
const apiresponse_typing_animation_element = chat_contentbox.querySelector(".apiresponse_typing_animation");
apiresponse_typing_animation_element.remove();
let ptag = document.createElement("p");
ptag.textContent = show_apiresponse;
chats_container.appendChild(ptag);
}

const create_outgoing_incoming_chat_elements = (html_structure,chat_class_name) => {
    const outgoing_chat_element = document.createElement("div"); 
    outgoing_chat_element.className = chat_class_name;
    outgoing_chat_element.innerHTML = html_structure;
    return outgoing_chat_element;
}

const handle_outgoing_chats = () => {
    if(chat_input_textarea_prompt.value !== "") {
        usertext = chat_input_textarea_prompt.value.trim();
        submit_prompticon.classList.add("valid_input");
        const chat_structure = `<div class="chat_maincontentbox">
        <div class="chat_profile">
            <img src="images/userprofilepic.jpeg" alt="user profile pic" class="userprofilepic">
            <h4 class="chat_username_title">you</h4>
        </div>
        <div class="chat_contentbox">
            <p class="chat_content">${usertext}</p>
        </div>
        <div class="edit_icondiv">
            <i class="fa-solid fa-pencil"></i>
        </div>
    </div>`;
    const outgoing_chatdiv = create_outgoing_incoming_chat_elements(chat_structure,"outgoing_chats");
    // =========================================== outgoing chat user's prompt message ===========================================
    chats_container.appendChild(outgoing_chatdiv);
    chat_input_textarea_prompt.value = "";
    setTimeout(show_api_response_typing_animation,500);
    get_chat_response(usertext);
    }
    else {
        console.log("empty input fields aren't allowed");
        submit_prompticon.classList.remove("valid_input");
    }
}

submit_prompticon.addEventListener("click", handle_outgoing_chats);
chat_input_textarea_prompt.addEventListener("keyup",(e)=>{
    // console.log(`the keycode for ${e.key} is ${e.keyCode}`);
    if(e.keyCode === 13 || e.key === "enter") {
        if(chat_input_textarea_prompt.value !== "") {
            handle_outgoing_chats();
        }
        chat_input_textarea_prompt.value = "";
    }
})