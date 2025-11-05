'use client'
import Drivingforce from "./components/Drivingforce"
import Footer from "../ui/footer"
import Innovation from "./components/Innovation"
import Goal from "./components/Goal"
import Myteam from "./components/Myteam"
import Navigation from "../ui/Navigation"

export default function About() {
  return (
    <section className="font-kanit bg-gray-100 ">
      <Navigation />
      <Innovation />
      <Goal />
      <Myteam />
      <Drivingforce />
      <Footer />
    </section>
  )
}