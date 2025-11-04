'use client'
import Drivingforce from "./components/Drivingforce"
import Footer from "../ui/footer"
import Innovation from "./components/Innovation"
import Goal from "./components/Goal"

export default function About() {
  return (
    <section className="front-kanit">
      <Innovation />
      <Goal />
      <Drivingforce />
      <Footer/>
    </section>
  )
}