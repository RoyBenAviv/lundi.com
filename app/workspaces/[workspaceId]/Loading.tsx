"use client"

import Lottie from "lottie-react"
import animationData from '../../assets/monday-animation.json'
export default function Loading() {
    return <section className="loading"><Lottie animationData={animationData} /></section>
  }