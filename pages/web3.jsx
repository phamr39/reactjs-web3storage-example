import React, { useState } from "react";
import { Web3Storage } from 'web3.storage'

const API_TOKEN = "This is API Key";

export default class Web3test extends React.Component {

    constructor(props, state) {
        super(props);
        this.state = {
            file: null,
            display: false,
        }
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
