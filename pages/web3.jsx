import React, { useState } from "react";
import { Blob, Web3Storage } from 'web3.storage'

const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEUyOGVBOTU5MEEzQWM3ZWQwZWIwQThkMkIzYjhCNzQwNjZkNzllQTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDM3Mjc3MjM2MTcsIm5hbWUiOiJuZXV0cmlubyJ9.q7sgeq1V-_01aAuwYkUvL5L08d4q4CuMvJv9_y_WY2Y";

export default class Web3test extends React.Component {

    constructor(props, state) {
        super(props);
        this.state = {
            file: null,
            display: false,
        }
        this.json_test();
    }



    makeFileObjects() {
        const obj = {
            hello: 'world',
            hello_1: 'world',
            hello_2: 'world',
            hello_3: 'world',
            hello_4: 'world',
            hello_5: 'world',
            hello_6: 'world',
            hello_7: 'world',
            hello_8: 'world',
            hello_9: 'world'
        }
        const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

        const files = [ new File([blob], 'hello.json') ]
        return files
    }

    async json_test() {
        const file = this.makeFileObjects();
        // Pack files into a CAR and send to web3.storage
        console.log('Starting...', new Date());
        const client = new Web3Storage({ token: API_TOKEN })

        const rootCid = await client.put(file) // Promise<CIDString>

        // Get info on the Filecoin deals that the CID is stored in
        const info = await client.status(rootCid) // Promise<Status | undefined>
        console.log('Uploaded', new Date());

        // Fetch and verify files from web3.storage
        const res = await client.get(rootCid) // Promise<Web3Response | null>

        const files = await res.files() // Promise<Web3File[]>
        console.log('Retrieved', new Date());

        for (const file of files) {
            console.log(`${file.cid} ${file.name} ${file.size}`);
            // this.state.file = await file.text();
            let reader = new FileReader();
            reader.readAsText(file, 'utf-8');
            reader.onload = (e) => {
                console.log('This is Object => ', JSON.parse(e.target.result));
            }
        }
        console.log('Shown', new Date());
    }

    async handleChange(e) {
        const file = e.target.files;
        // Pack files into a CAR and send to web3.storage
        console.log('Starting...', new Date());
        const client = new Web3Storage({ token: API_TOKEN })

        const rootCid = await client.put(file) // Promise<CIDString>

        // Get info on the Filecoin deals that the CID is stored in
        const info = await client.status(rootCid) // Promise<Status | undefined>
        console.log('Uploaded', new Date());

        // Fetch and verify files from web3.storage
        const res = await client.get(rootCid) // Promise<Web3Response | null>

        const files = await res.files() // Promise<Web3File[]>
        console.log('Retrieved', new Date());

        for (const file of files) {
            console.log(`${file.cid} ${file.name} ${file.size}`);
            // this.state.file = await file.text();
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                this.state.file = e.target.result;
                this.setState(this.state)
            }
        }
        console.log('Shown', new Date());

    }

    render() {
        return <h2> Heluuu
            <form>
                <label>
                    <input
                        type="file"
                        name="upload file"
                        id="upload-file"
                        accept=".jpg"
                        onChange={async (e) => {
                            await this.handleChange(e);
                        }}
                        onSubmit={(e) => {
                            this.handleSubmit();
                        }} />
                </label>
                <input type="submit" value="Submit" />
            </form>
            <img src={this.state.file} />

        </h2>;
    }
}
