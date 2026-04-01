import React from "react";
import Hero from "../components/Hero";
import LatestListing from "../components/LatestListing";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const Home = () => {
	return (
		<div>
			<Hero />
			<LatestListing />
			<CTA />
		</div>
	);
};

export default Home;
