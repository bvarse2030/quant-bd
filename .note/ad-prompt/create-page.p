update /src/app/dashboard/my-trade/pgae.tsx

We will take trading notes. Utility for trading [prompt, take image(15Minutes,1Hour), take trade, Clear past Trade, take note]. Analise Trade by data.

I want to store 
authorEmail, lot, entryPrice, TP1, TP2, SL, result, time, sell Stop | buy stop, profit | loss | draw, tradingStartDate, tradingEndDate, tradingStartTime, tradingEndTime

update /src/app/page.tsx [only Trader can see this]
    - At the top there is an accordian with two button Edit and Copy. the accordian display a prompt which is load from local storage and if not found then show please add one. and I can update the prompt throw edit button. and can copy by single click.