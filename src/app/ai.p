Look at the page.tsx 
```

const Page = () => {
  return <main>Page</main>;
};
export default Page;

```

Market Open & Close (EURUSD - BST)
Weekly Open: Monday at 4:00 AM.
Weekly Close: Saturday at 2:00 AM.


Now your task is update this page with the following instructions.
1. Timing section
    - Display 7 Days start with Monday. today is active class with other class. 
    - If today market is open then check the time if it is between 12:00 PM to 1:00 PM then it show Place Order and save status is activeTrade. And show a button named Add Entry.
    - If it is not time then remove Add Entry Button and Show a Box with Please Wait and make status as waitingTrade. and make a coun-down.
2. Show a summery box. [if status is waitingTrade then it will display second and if status is activeTrade then it will display at the last]
3. There show a list of Entry.
    Each Entry have 
        - open date
        - open time
        - close date
        - close time
        - volume
        - entry
        - TP
        - SL
        - result => Profit $ || Loss $
        - is placed => boolean
        - trick number
        - View and Edit button. 
4. Make pagination if there are more then 10 data (Entry)
5. Make mobile first Design with eye-catching view and animation. use less padding. and dark green, sci-fi color of all theme. 
         
