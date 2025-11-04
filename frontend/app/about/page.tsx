'use client'
import Drivingforce from "./components/Drivingforce"
import Footer from "../ui/footer"
import Innovation from "./components/Innovation"
import Goal from "./components/Goal"
import Myteam from "./components/Myteam"

export default function About() {
  return (
    <section className="">
      <Innovation />
      <Goal />
      <Myteam/>
      <Drivingforce />
      <Footer/>
    </section>
  )
}