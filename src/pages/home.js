import React from "react";
import './Home.css'; // CSS dosyasını import etmeyi unutmayın

export function Home() {
    return (
        <div className="container my-5">
            <h2 className="text-center">Bu Web Uygulaması Projelerinizin Kolayca Yönetmenizi Sağlar.</h2>
            <div className="text-center mt-4">
                <iframe
                    src="https://giphy.com/embed/0tvLwQiNjT3G6bnTzl"
                    width="480"
                    height="271"
                    frameBorder="0"
                    className="giphy-embed"
                    allowFullScreen
                    title="Completion GIF"
                ></iframe>
                <p>
                    <a href="https://giphy.com/gifs/HollerStudios-animation-reaction-gif-holler-studios-0tvLwQiNjT3G6bnTzl">
                        via GIPHY
                    </a>
                </p>
            </div>
        </div>
    );
}
