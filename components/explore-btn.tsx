'use client'

import Image from "next/image"

const ExpBtn = () => {
    return (
        <button type="button" id="explore-btn" className="mt-7 mx-auto" onClick={() => console.log("first")}>
        <a href="#events">Explore Events
            <Image src="/icons/arrow-down.svg" width={20} height={20} alt="arrow"/>
        </a>
        </button>
    )
}

export default ExpBtn