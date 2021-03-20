"use strict";
{
    const c = document.getElementById("mainCanvas");
    const ctx = c.getContext("2d");
    const w= c.clientWidth;
    const h= c.clientHeight;
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    //const creatorAddress = '0xc5a2f28bacf1425bfaea14834486f0e9d0832155';
    const creatorAddress = '0x45c51324bc2a27ce428e6820b7905b0fd437431d';
    const creatorName = 'pak';



    let mousex=0;
    let mousey=0;
    let lastClick = performance.now();

    let collectors = new Map();
    let minTime = 3000000000000000000;
    //let minTime = new Date('February 1, 2020 00:00:00').getTime();
    let maxTime =  new Date('March 30, 2021 00:00:00').getTime();
    //console.log(minTime);
    //console.log(maxTime);
    //parse the list on events
    let all_nfts = (data);

    let selected_nft = -1;
    let nfts = new Map();
    //console.log(all_nfts);
        
    let scale = 1.0;

    if(w>1000) {
        ctx.font = '22px sans-serif';
        scale = 2.0;
    } else {
        ctx.font = '11px sans-serif';
    }
    ctx.lineWidth = scale;

    //we want to create the nfts, look for the creation time
    all_nfts.forEach((nfto) => {
        let nft = {};
        nft.tokenID = nfto.tokenID;
        nft.name = nfto.name;

        nft.transfers = [];
        nft.positions = [];
        let last_value = 0;
        nft.last_owner = zeroAddress;
        //get the events
        if(nfto.events != undefined){
            nfto.events.reverse();
            nfto.events.forEach( (e) => {
                let when = new Date(e.blockTimestamp);
                let blockTime = when.getTime();
            if(e.eventType === "creation"){
                nft.createdAt = blockTime;
                nft.createdBy = e.creation.firstOwner.address;
                nft.last_owner = nft.createdBy;
            } else if (e.eventType === "accept_bid") {
                last_value = parseInt(e.acceptBid.amount)/1000000000000000000;
               
                let transfer = {
                    from: e.acceptBid.seller.address,
                    to: e.acceptBid.bidder.address,
                    time: blockTime,
                    value: last_value,
                };
                if(collectors.has(transfer.from) == false){
                    if(e.acceptBid.seller.user == null) {
                        collectors.set(transfer.from, {name: "anonymous"});
                    } else {
                        collectors.set(transfer.from, {name: e.acceptBid.seller.user.username});
                    }
                };
                if(collectors.has(transfer.to) == false){
                    if(e.acceptBid.bidder.user == null) {
                        collectors.set(transfer.to, {name: "anonymous"});
                    } else {
                        collectors.set(transfer.to, {name: e.acceptBid.bidder.user.username});
                    }
                };
                //collectors.add(transfer.from);
                //collectors.add(transfer.to);
                nft.last_owner = transfer.to;
                nft.transfers.push(transfer);
            } else if (e.eventType === "transfer") {
                let transfer = {
                    from: e.transfer.from.address,
                    to: e.transfer.to.address,
                    time: blockTime,
                    value: last_value,
                };
                //console.log(e);
                    
                //do we know the from and to?
                if(collectors.has(transfer.from) == false){
                    if(e.transfer.from.user != null) {
                        collectors.set(transfer.from, {name: e.transfer.from.user.username});
                    } else {
                        collectors.set(transfer.from, {name: "anonymous"});
                    }
                };
                if(collectors.has(transfer.to) == false){
                    if(e.transfer.to.user != null) {
                        collectors.set(transfer.to, {name: e.transfer.to.user.username});
                    } else {
                        collectors.set(transfer.to, {name: "anonymous"});
                    }
                };
                //collectors.add(transfer.from);
                //collectors.add(transfer.to);
                nft.last_owner = transfer.to;
                nft.transfers.push(transfer);
            } else if (e.eventType === "sale"){
                last_value = parseInt(e.sale.amount)/1000000000000000000;
                let transfer = {
                    from: e.sale.seller.address,
                    to: e.sale.buyer.address,
                    time: blockTime,
                    value: last_value,
                };
                //console.log(e);
                    
                //do we know the from and to?
                if(collectors.has(transfer.from) == false){
                    if(e.sale.seller.user != null) {
                        collectors.set(transfer.from, {name: e.sale.seller.user.username});
                    } else {
                        collectors.set(transfer.from, {name: "anonymous"});
                    }
                };
                if(collectors.has(transfer.to) == false){
                    if(e.sale.buyer.user != null) {
                        collectors.set(transfer.to, {name: e.sale.buyer.user.username});
                    } else {
                        collectors.set(transfer.to, {name: "anonymous"});
                    }
                };
                //collectors.add(transfer.from);
                //collectors.add(transfer.to);
                nft.last_owner = transfer.to;
                nft.transfers.push(transfer);
                //console.log(transfer);
            }
            minTime = Math.min(minTime, blockTime);
            maxTime = Math.max(maxTime, blockTime);

        });
            nfts.set(nfto.tokenID, nft);
        }
            




    });
    //console.log(minTime);
    //console.log(maxTime);
    //first block is Feb-12-2020 09:55:51 PM +UTC
    //last block is Mar-09-2021 08:51:23 PM +UTC
    //add manual events aka superrare api not very helpful
    let nft_extra = {
        tokenID: 13916,
        name: 'Superpositions of a Wandering Cube',
        transfers: [],
        positions: [],
        last_value:2.5,
        createdAt : new Date('Sep-24-2020 09:48:09 AM').getTime(),
        createdBy : creatorAddress,
        last_owner: creatorAddress,
    }
    nft_extra.transfers.push({
        from: creatorAddress,
        to: '0x00668bd79ede077b99bbe1c4db59418bc333d4cf',
        time: new Date('Dec-22-2020 05:33:24 PM').getTime(),
        value: 20,
    });
    nft_extra.last_owner = '0x00668bd79ede077b99bbe1c4db59418bc333d4cf';
    collectors.set('0x00668bd79ede077b99bbe1c4db59418bc333d4cf', {name: "zonted"});

    nfts.set(nft_extra.tokenID, nft_extra);


    //add manual events
    let nft_extra2 = {
        tokenID: 13961,
        name: 'Superpositions of Revolving Cubes',
        transfers: [],
        positions: [],
        last_value: 50,
        createdAt : new Date('Sep-25-2020 02:52:18 PM').getTime(),
        createdBy : creatorAddress,
        last_owner: creatorAddress,
    }
    nft_extra2.transfers.push({
        from: creatorAddress,
        to: '0x9e8b401a1173539a92e640629c0e004a9803dfb1',
        time: new Date('Sep-25-2020 08:28:35 PM').getTime(),
        value: 44,
    });
    nft_extra2.transfers.push({
        from: '0x9e8b401a1173539a92e640629c0e004a9803dfb1',
        to: '0x54d7f921785ebe46010d83c73712e80dfaff1e81',
        time: new Date('Mar-12-2021 10:59:13 AM ').getTime(),
        value: 50,
    });

    nft_extra2.last_owner = '0x54d7f921785ebe46010d83c73712e80dfaff1e81';
    collectors.set('0x9e8b401a1173539a92e640629c0e004a9803dfb1', {name: "fafafofo"});
    collectors.set('0x54d7f921785ebe46010d83c73712e80dfaff1e81', {name: "curiousnfts"});

    nfts.set(nft_extra2.tokenID, nft_extra2);

    let nft_extra3 = {
        tokenID: 17132,
        name: 'The Auction',
        transfers: [],
        positions: [],
        last_value: 50,
        createdAt : new Date('Dec-11-2020 01:19:40 PM').getTime(),
        createdBy : creatorAddress,
        last_owner: creatorAddress,
    }
    nft_extra3.transfers.push({
        from: creatorAddress,
        to: '0x7d21dac0342215cf5c4b46d0300bbf8c9c5978cd',
        time: new Date('Dec-12-2020 04:12:54 PM').getTime(),
        value: 39,
    });

    nft_extra3.last_owner = '0x7d21dac0342215cf5c4b46d0300bbf8c9c5978cd';
    collectors.set('0x7d21dac0342215cf5c4b46d0300bbf8c9c5978cd', {name: "pablo"});

    nfts.set(nft_extra3.tokenID, nft_extra3);

    /*
    //add last one events
    let last_nft = {
        tokenID: 20000,
        name: 'The 100th',
        transfers: [],
        positions: [],
        last_value: 0,
        createdAt:  new Date('March 19, 2021 00:00:00').getTime(),
        createdBy : creatorAddress,
        last_owner: creatorAddress,
    }

    nfts.set(20000,last_nft);
    */

    maxTime = new Date('April 01, 2021 00:00:00').getTime();//last_nft.createdAt;
    //console.log(maxTime);
    //console.log(minTime);

    //console.log(collectors);
    //console.log(collectors.get("0x1da5331994e781ab0e2af9f85bfce2037a514170"));

    collectors.delete(creatorAddress);
    //how many addresses do we have 
    let addresses = Array.from(collectors.keys());
    //we want to sort that by number of final pieces
    let pieces = new Map();
    for(let address of addresses){
       pieces.set(address, 0);
    }
    for (let key of nfts.keys()) {
        let who = nfts.get(key).last_owner;
        if(pieces.has(who)){
            let npieces = pieces.get(who);
            pieces.set(who, npieces+1);
        } else {
            //pieces.set(who, 1);
        }
    }
    //console.log(pieces);
    //console.log(addresses);
    addresses.sort( (a,b) => 
       pieces.get(b) - pieces.get(a)
    );
    console.log(addresses);
    let n_addresses = addresses.length;
    //now we can convert 
    console.log(n_addresses);

    //console.log(nfts);
    function findClosest() {
        selected_nft = -1;
        let d_min = 50.0;
        for (let key of nfts.keys()) {
            let nft = nfts.get(key);
            nft.positions.forEach( (point) => {
                let d = Math.sqrt( (point.x-mousex)*(point.x-mousex)+(point.y-mousey)*(point.y-mousey));
                if(d<d_min){
                    d_min = d;
                    selected_nft = nft.tokenID;
                }
            });
        }
    }

    function drawCircle(x,y,size,fill) {
        //ctx.fillStyle=fill;
        ctx.strokeStyle=fill;
        ctx.lineWidth = size*0.5;
        ctx.beginPath();
        ctx.arc(x,y,size*0.75, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.lineWidth = scale;
    }
    function drawEmptyCircle(x,y,size,stroke) {
        ctx.strokeStyle=stroke;
        ctx.beginPath();
        ctx.arc(x,y,size, 0, 2 * Math.PI);
        ctx.stroke();
    }
    function link_f(x_0,y_0, size0, x_3, y_3, size1, stroke,f){
        //the thing starts at 0, is full at 0.5 then is gone at 1
        ctx.strokeStyle=stroke;
        //30 points on the bezier line
        //at 0.5 they span 0 to 1
        //at 0 
        //
        let t0 = Math.max(2.0*f-1.0,0.0);
        let t1 = Math.min(2.0*f,1.0);
        ctx.beginPath();
        for(let i = 0;i<30.0;++i){
            let fi = i/29.0;
            let f = t0+fi*(t1-t0);
            let x0= x_0;
            let x1= x_0;
            let x2= x_3-size1-20;
            let x3= x_3-size1;

            let y0= y_0;
            let y1= y_0;
            if(y_0<y_3) {
                y0 = y_0+size0;
                y1 = y_0+size0+20;
            } else {
                y0 = y_0-size0;
                y1 = y_0-size0-20;
            }
            let y2= y_3;
            let y3= y_3;

            let ix = (1.0-f)*(1.0-f)*(1.0-f)*x0 + 
                3.0*(1.0-f)*(1.0-f)*f*x1 +
                3.0*(1.0-f)*f*f*x2 + 
                f*f*f*x3;
            let iy = (1.0-f)*(1.0-f)*(1.0-f)*y0 + 
                3.0*(1.0-f)*(1.0-f)*f*y1 +
                3.0*(1.0-f)*f*f*y2 + 
                f*f*f*y3;
            if(i==0){
                ctx.moveTo(ix,iy);
            } else {
                ctx.lineTo(ix,iy);
            }
        }
        ctx.stroke();
    }
        


    function link(x0,y0,size0, x1, y1,size1,stroke) {
        ctx.strokeStyle=stroke;
        ctx.beginPath();
        if(y0<y1){
        ctx.moveTo(x0,y0+size0);
        ctx.bezierCurveTo(x0,y0+size0+20, x1-size1-20,y1, x1-size1,y1);
        } else {
        ctx.moveTo(x0,y0-size0);
        ctx.bezierCurveTo(x0,y0-size0-20, x1-size1-20,y1, x1-size1,y1);

        }
        ctx.stroke();
    }
    c.addEventListener('mousemove', e => {
            mousex = e.offsetX;
            mousey = e.offsetY;
            findClosest();
        //find closest
    });
    c.addEventListener('mousedown', e => {
        lastClick = performance.now();
        n_frame = 0;
        //find closest
    });

    let n_frame = 0;
    requestAnimationFrame(draw);
    //iterate over all nfts
    
    function draw(ts) {
        //ts is the time stamp
        requestAnimationFrame(draw);
        //clear
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle='#070606';
        ctx.fillRect(0,0,w,h);

        ctx.fillStyle='none';
        ctx.strokeStyle='none';
        let selected_collectors = [];
        let collectors_count = new Map();
        let number_created = 0;

        let f_anim = (performance.now()-lastClick)/5000;
        //let f_anim = n_frame/300.0;//(performance.now()-lastClick)/5000;
        //let global_end = Math.max(Math.min(1.0,(380-n_frame)/30.0),0.0);
        let global_end = 1.0;
        //let f_anim = mousex/1024.0;

        for (let key of nfts.keys()) {
            let nft = nfts.get(key);

            let ftime = (nft.createdAt-minTime)/(maxTime-minTime);
            //get creation time
            let first = (nft.positions.length == 0) ;

            let currentPos_x = w*0.05+ftime*w*0.75;
            let currentPos_y = h*0.05;
            let currentSize = w*0.003;
            let style = "rgba(100,100,100,"+global_end*0.5+")";
            let style2 = "rgba(255,255,255,"+global_end*0.5+")";
            let style0 = "rgba(255,255,255,"+global_end*0.1+")";
            //let style2 = "#555";
            let selected = (nft.tokenID == selected_nft);
            if(selected) {
                style = "rgba(150,150,150,"+global_end*0.9+")";
                style2 = "rgba(255,255,255,"+global_end*0.9+")";
                style0 = "rgba(255,255,255,"+global_end*0.8+")";
            }
           
            if(first) {
                nft.positions.push({
                    x:currentPos_x,
                    y:currentPos_y,
                });
            }

            
            let last_time = ftime;
            if(selected){
                //console.log(nft);
              
                drawCircle(currentPos_x, currentPos_y, currentSize, style);
                ctx.fillStyle=style2;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                //ctx.fillText(nft.tokenID,currentPos_x, currentPos_y-20);
                ctx.fillText(nft.name,currentPos_x, currentPos_y-22*scale);
                //ctx.textAlign = 'left';
                //ctx.textBaseline = 'middle';
                //ctx.fillText(collectors.get(nft.createdBy).name,w*0.9, currentPos_y);
                if(f_anim>ftime){
                    number_created+=1;
                }
            } else {
                if(f_anim>ftime){
                    drawEmptyCircle(currentPos_x, currentPos_y, currentSize, style);
                    number_created+=1;
                }
            }
            //draw the transfers
            for(let i=0;i<nft.transfers.length;++i){
                //where should we go
                let fh = addresses.indexOf(nft.transfers[i].to)*1.0/n_addresses;

                let ftime = (nft.transfers[i].time-minTime)/(maxTime-minTime);
                let nextPos_x = w*0.05+ftime*w*0.75;
                let nextPos_y = h*0.1+fh*h*0.8;
                let nextSize = w*0.0005*nft.transfers[i].value;
                //draw bezier 
                let f = Math.min(Math.max((f_anim-ftime)*10.0,0.0),1.0);
                if( Math.abs(f-0.5)<0.2 || selected) {
                    //selected=true;
                    selected_collectors.push(nft.transfers[i].to);
                //}else {
                    //selected=false;
                }

                link_f(currentPos_x, currentPos_y, currentSize, nextPos_x, nextPos_y, nextSize,style2,f);
                //show after a transfer is done
                if(f>0.5){
                    link(currentPos_x, currentPos_y, currentSize, nextPos_x, nextPos_y, nextSize,style0);
                    //add one to that collector
                }
                currentPos_x = nextPos_x;
                currentPos_y = nextPos_y;
                currentSize = nextSize;
                if(first) {
                    nft.positions.push({
                        x:currentPos_x,
                        y:currentPos_y,
                    });
                }
                let fs = Math.max(0.0,Math.min((f_anim-ftime)*10.0,1.0));
                style = 'rgba(255,255,255,'+fs*global_end+')';
                //if(selected) {
                if(i<nft.transfers.length-1) {
                drawEmptyCircle(nextPos_x, nextPos_y, nextSize, style);
                }

                fs = 1.0-Math.min(Math.abs((f-0.5)*10.0,0.0),1.0);
                if(i==nft.transfers.length-1){
                    //if we are the last transfer for that nft, stop here
                    let f = Math.min(Math.max((f_anim-ftime)*10.0,0.0),1.0);
                    fs = Math.max(fs,(1.0-Math.min((0.5-f)*10.0,1.0))*0.05);
                    if(f_anim>ftime){
                    if(collectors_count.has(nft.transfers[i].to)) {
                        let count = collectors_count.get(nft.transfers[i].to);
                        collectors_count.set(nft.transfers[i].to, count+1);
                    } else {
                        collectors_count.set(nft.transfers[i].to, 1);
                    }
                    }
                }
                style = 'rgba(255,255,255,'+fs*global_end+')';
                if(selected) {
                    style = 'rgba(255,255,255,'+global_end*1.0+')';
                }
                
                drawCircle(nextPos_x, nextPos_y, nextSize, style);

                last_time=ftime;
                //ctx.fillStyle = style2;
                //ctx.textAlign = 'left';
                //ctx.textBaseline = 'middle';
                //selected_collectors.push(nft.transfers[i].to);
                //ctx.fillText(collectors.get(nft.transfers[i].to).name,w*0.9, currentPos_y);
                //} else {
                //drawEmptyCircle(nextPos_x, nextPos_y, nextSize,style); 
                //ctx.fillStyle=style;
                //ctx.textAlign = 'left';
                //ctx.textBaseline = 'middle';
                //ctx.fillText(collectors.get(nft.transfers[i].to).name,w*0.92, currentPos_y);
                //}

            }
        };
        //draw the collectors
        let fstyle = "rgba(100,100,100,"+global_end*1.0+")";
        let fstyle2 = "rgba(255,255,255,"+global_end*1.0+")";
        let style = "rgba(100,100,100,1.0)";
        let style2 = "rgba(255,255,255,1.0)";
        ctx.fillStyle=style2;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(creatorName.toUpperCase(),w*0.85, h*0.05);

        if(number_created>0){
            ctx.textAlign = 'right';
            ctx.fillStyle=fstyle2;
            ctx.fillText(number_created ,w*0.85-8, h*0.05);
        }
        for(let i=0;i<addresses.length;++i){
            let fh = i*1.0/n_addresses;

            let pos_y = h*0.1+fh*h*0.8;
            if(selected_collectors.includes(addresses[i])) {
                ctx.fillStyle=style2;
            } else {
                ctx.fillStyle=style;
            }
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(collectors.get(addresses[i]).name.toUpperCase(),w*0.85, pos_y);
            if(collectors_count.has(addresses[i])){
                ctx.fillStyle=fstyle2;
                ctx.textAlign = 'right';
                ctx.fillText(collectors_count.get(addresses[i]),w*0.85-8, pos_y);
            }
        }


        style = "rgba(100,100,100,1.0)";
        style2 = "rgba(255,255,255,1.0)";
        //legend
        ctx.beginPath();
        ctx.strokeStyle= "rgba(100,100,100,0.5)";
        //ctx.rect(w*0.045, h*0.8,w*0.205,h*0.13);
        ctx.rect(w*0.045, h*0.8,w*0.145,h*0.13);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle= "rgba(100,100,100,0.1)";
        //ctx.rect(w*0.045, h*0.8,w*0.205,h*0.12);
        ctx.rect(w*0.045, h*0.8,w*0.145,h*0.13);
        ctx.fill();

        ctx.fillStyle=style2;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('PAK ON SUPERRARE',w*0.06, h*0.82);
        ctx.fillText(nfts.size+' NFTS',w*0.06, h*0.845);
        ctx.fillText(n_addresses+' COLLECTORS',w*0.06, h*0.86);
        ctx.fillText('FROM FEB. 3 2020',w*0.06, h*0.875);
        ctx.fillText('BY MACTUITUI',w*0.06, h*0.9);
        ctx.fillText('CLICK TO REPLAY',w*0.06, h*0.915);
        //can we draw the time
        //
            //draw time
            
            ctx.strokeStyle= "rgba(100,100,100,0.5)";
            ctx.beginPath();
            ctx.moveTo(w*0.04, h*0.04);
            ctx.lineTo(w*0.815, h*0.04);
            ctx.lineTo(w*0.81, h*0.037);
            ctx.moveTo(w*0.815, h*0.04);
            ctx.lineTo(w*0.81, h*0.043);
            ctx.stroke();

            //ctx.moveTo(w*0.05, h*0.037);
            //ctx.lineTo(w*0.05, h*0.043);
            //ctx.stroke();
            for(let i = 0;i<15;++i){
                let fi = i/14.0;
                if(i==11 ) {
                    ctx.strokeStyle= "rgba(200,200,200,0.8)";
                } else {
                    ctx.strokeStyle= "rgba(100,100,100,0.5)";
                }
                ctx.beginPath();
                ctx.moveTo(w*0.05+fi*w*0.75, h*0.037);
                ctx.lineTo(w*0.05+fi*w*0.75, h*0.043);
                ctx.stroke();
            }

        if(selected_nft == -1) {
            ctx.beginPath();
            ctx.fillStyle= "rgba(100,100,100,0.5)";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('FEB. 2020',w*0.05, h*0.05-22*scale);
            ctx.fillText('APR. 2021',w*0.8, h*0.05-22*scale);

        }

        if(n_frame<380){
            //save_frame(ctx, n_frame);
        }
        n_frame += 1;
    }


    //todo
    //add time legend on top
    //add description box
    // ARC on SuperRare 
    // A Graphic History
    // 
    // 

    function save_frame(ctx, n) {
        const data = ctx.canvas.toDataURL("image/png");
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                console.log(`OK SAVE ${n} -- ${xhr.responseText}`);
            }
        }
        // you can use 0.0.0.0:8080 here for localhost, or a local IP so you can have your
        // desktop PC crunch frames and send it to your laptop for processing or whatever.
        xhr.open('POST', `http://0.0.0.0:8080/save?desc=pak&frame=${n}`);
        xhr.send(data);
    }
        


}
