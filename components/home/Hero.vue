<template>
  <section
    className="box lg:h-[82vh] md:h-[50vh] flex flex-col-reverse md:flex-row justify-between gap-8 md:gap-16 px-5 sm:px-14 md:px-20 lg:px-32 my-5"
  >
    <div
      className="flex flex-col items-center md:items-start justify-center md:basis-1/2 gap-4"
    >
      <span
        className="text-primary text-sm px-4 py-1 rounded-full border-2 border-primary max-w-max"
      >
        Feast. Share. Connect.
      </span>
      <h2 className="font-bold text-3xl md:text-5xl text-center md:text-start">
        Welcome to <span className="text-primary">Tastebite</span>
      </h2>
      <p className="text-gray-600 text-center md:text-start">
        Where food lovers unite to discover mouthwatering recipes, delightful
        restaurants, and engaging food discussions. Explore, share, and connect
        over the joy of cooking and dining.
      </p>
      <NuxtLink to="/recipe">
        <button
          class="mt-4 px-4 py-1 md:mt-8 md:py-2 md:px-7 md:text-lg max-w-max rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition duration-300 ease-in-out"
        >
          Explore Recipes
          <Icon name="game-icons:knife-fork" size="30px" />
        </button>
      </NuxtLink>
    </div>
    <div
      className="basis-1/2 bg-hero bg-no-repeat bg-cover bg-center rounded-xl bg-[url('~/assets/img/hero-bg.jpeg')]"
    ></div>
  </section>
</template>
