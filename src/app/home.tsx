"use client"

export default function Home() {
    return (
        <main>
            <p>
                Bienvenue sur Linguistica, nous vous proposons de vous enseigner plus de 30 langues par nos 205 intervenants répartis dans toute la France.
            </p>
            <p>
                Choissisez les langues que vous souhaitez étudier et nous vous proposerons une forumle adaptée à vos besoins.
            </p>
            <form action="">
                {/* <select name="" id="">
          <option value="Français">Français</option>
          <option value="Anglais">Anglais</option>
          <option value="Espagnol">Espagnol</option>
          <option value="Allemand">Allemand</option>
          <option value="Italien">Italien</option>
          <option value="Portugais">Portugais</option>
          <option value="Arabe">Arabe</option>
          <option value="Chinois">Chinois</option>
          <option value="Russe">Russe</option>
        </select> */}
                <fieldset>
                    <legend>Which country</legend>
                    <div className="control">
                        <input type="checkbox" id="français" name="acquisition" value="français" />
                        <label htmlFor="français">Français</label>
                    </div>
                    <div className="control">
                        <input type="checkbox" id="français" name="acquisition" value="français" />
                        <label htmlFor="français">Français</label>
                    </div>
                    <div className="control">
                        <input type="checkbox" id="français" name="acquisition" value="français" />
                        <label htmlFor="français">Français</label>
                    </div>
                    <div className="control">
                        <input type="checkbox" id="français" name="acquisition" value="français" />
                        <label htmlFor="français">Français</label>
                    </div>
                </fieldset>
            </form>
        </main>
    );
}
