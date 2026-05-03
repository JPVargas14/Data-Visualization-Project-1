# Data-Visualization-Project-1

## Motivation
For this project, I was motivated by the underrepresentation of women in STEM, particularly in engineering. This is something that I see every day, and I wanted to learn through data how we may have reached the point where we are today through history, and how it differs amongst different regions of the world.

## Data
The data I used can be found on the [Our World in Data website](https://ourworldindata.org/grapher/gender-gap-education-levels). This data set includes the enrollment rates for boys and girls across primary, secondary, and tertiary schools from countries and regions around the world. It is worth noting that not every country has consistent data; a lot have different ranges than others. It is also important to know that there are two types of data available: the data by region and by country. The regional data has the largest range, which is why it is used for the line plots, and the country data is used for the choropleth maps. The country data generally only goes in increments of 5 years until the late 2010s, which is why I chose to set the chloropleth map to jump in multiples of 5. The most consistent data between the primary, secondary, and tertiary enrollment rates were the primary rates, and many countries and regions would consistently be missing the other rates, which is why I chose to focus on these for my visualizations.

## Visualizations
<img width="1130" height="345" alt="image" src="https://github.com/user-attachments/assets/d008ffba-aa58-463f-ab30-cdcf596e57de" />
There are 3 main visualizations. The first one above shows the primary enrollment rates for two regions, which can be changed using the drop-down selector. It shows the rates as a percentage, colored by gender. This is coupled with the second visualization (shown below), which shows the percent difference from the left chart to the right chart for both genders. The idea is to show which country has higher or lower enrollment rates and how it may change over time.

<img width="723" height="265" alt="image" src="https://github.com/user-attachments/assets/fc0a8d11-3d5d-4b80-a79d-9e9b6c5837cb" />

The third and last visualization is a choropleth map, which shows the enrollment rates across the world for a given year. There is a timeline scrub bar that lets the user choose a year to show on the map, as well as a play button to run an animation through the data on the map.

<img width="1043" height="386" alt="image" src="https://github.com/user-attachments/assets/4debcbda-fd57-4f84-b5c8-ae1f737ded13" />

All three visualizations utilize a tooltip to provide further insights and exact numbers to the data being shown.

## Insights

There are various kinds of insights you can take away from these visualizations. Most of them are direct comparisons between two (maybe more) countries or regions, and comparing them over time. The use of the line plot with a plot for the difference between two countries shows the difference in trends over a time period, as well as helping explain why that disparity may exist. For example, Europe and South America had a large difference, which only continued to grow until the lead-up to the Second World War. At which point, European enrollment rates began to flatten, and South American enrollment rates grew greatly.

The other insights have to do with the comparison and difference between genders, and which countries are more equitable between males and females in regard to education. 

## Process
My process was to start by accessing and understanding the data using Pandas in Jupyter Notebooks. This is where I found gaps in the data and made my plan to use only the primary enrollment data. I then started to think of how I can display the different dimensions of the data, which is how I came up with one-on-one comparisons between regions and choropleth maps for more granular insights. I decided to go for basic formatting to focus my time more on getting good visualizations versus a more effective layout and UI.

## Challenges/Future Work
My main challenge was making the visualizations look nice and modern. I am not very good at formatting, selecting fonts, editing the containers, things like that. I would like to learn more about design principles and how to apply them since I think it is very important to engage users and convey information effectively.

## Use of AI
I used Co-Pilot bulit in to VSC for EDA in my Jupyter Notebooks since I struggle to remember some of the commands/functions. I would also use the chat feature when I get stuck using D3 and encounter errors. Particularly, I would get errors with my Java syntax (I have never used Java before this course) as well as in how I was calling the data at times (the whole arrow thing still confuses me).
