import {useState} from "react";
import {postDeleteService, postsAddService} from "../../services/postsFetchService.js";


export function Button(props) {
    const [pressButton, setPressButton] = useState(false);

    const handleClick = async () => {

        !pressButton && setPressButton(true);
        if (props.name === "addPost") {
            try {
                await postsAddService();
                console.log("Post Added");

            } catch (e) {
                console.error("Button handler werkt niet goed", e)
            }
        } else if (props.name === "deletePost18") {
            {
                try {
                    await postDeleteService()
                    console.log("Post ... verwijderd");

                } catch
                    (e) {
                    console.error("Button handler werkt niet goed", e)
                }
            }
        }
        setPressButton(false)
    }

    return (
        <button onClick={handleClick} disabled={pressButton} name={props.name}>
            {props.children}
        </button>
    )
}
