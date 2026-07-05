import Sidebar from "../../components/Sidebar";
import { voiceCommands } from "../../data/voiceData";

export default function VoiceAssistant() {

    return (

        <div className="dashboard">

            <Sidebar />

            <main className="main">

                {/* HEADER */}

                <div className="bf-header">

                    <div>

                        <h1>
                            AI Voice Assistant
                        </h1>

                        <p>
                            GreenSteel Smart Assistant
                        </p>

                    </div>

                    <div className="last-update">

                        Status: Active

                    </div>

                </div>

                {/* VOICE PANEL */}

                <div className="voice-panel">

                    <div className="voice-circle">

                        🎤

                    </div>

                    <h2>

                        Listening...

                    </h2>

                    <p>

                        Ask about emissions,
                        ESG, alerts or reports

                    </p>

                </div>

                {/* EXAMPLES */}

                <div className="panel">

                    <h3>

                        Example Commands

                    </h3>

                    {
                        voiceCommands.map(
                            (
                                command,
                                index
                            ) => (

                                <div
                                    key={index}
                                    className="voice-command"
                                >

                                    🎙️

                                    {command}

                                </div>

                            )
                        )
                    }

                </div>

                {/* RESPONSE */}

                <div className="panel">

                    <h3>

                        Assistant Response

                    </h3>

                    <div className="response-box">

                        Current ESG Score:
                        86/100.

                        Blast Furnace BF2
                        emissions are within
                        permissible limits.

                    </div>

                </div>

            </main>

        </div>

    );

}