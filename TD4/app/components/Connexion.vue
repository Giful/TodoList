<template>
  <Page>
    <ActionBar title="Connexion"></ActionBar>
    <FlexboxLayout class="container">
      <StackLayout class="connex">
        <StackLayout class="input-field" marginBottom="25">
          <TextField
            class="input"
            hint="Adresse mail"
            keyboardType="mail"
            autocorrect="false"
            autocapitalizationType="none"
            v-model="user.mail"
            returnKeyType="next"
            fontSize="18"
          />
          <StackLayout class="hr-light" />
        </StackLayout>

        <StackLayout v-show="estInscrit" class="input-field" marginBottom="25">
          <TextField
            ref="mdp"
            class="input"
            hint="Mot de passe"
            secure="true"
            v-model="user.mdp"
            returnKeyType="done"
            fontSize="18"
          />
          <StackLayout class="hr-light" />
        </StackLayout>

        <StackLayout v-show="!estInscrit" class="input-field" marginBottom="25">
          <TextField class="input" hint="Nom" v-model="user.nom" fontSize="18" />
          <StackLayout class="hr-light" />
        </StackLayout>

        <StackLayout v-show="!estInscrit" class="input-field" marginBottom="25">
          <TextField class="input" hint="Prénom" v-model="user.prenom" fontSize="18" />
          <StackLayout class="hr-light" />
        </StackLayout>

        <ListPicker v-show="!estInscrit" v-model="user.sexe" :items="sexe" />

        <Button v-if="estInscrit" text="Connexion" @tap="submit" class="btn m-t-20" />
        <Button v-else text="Inscription" @tap="submit" class="btn m-t-20" />
      </StackLayout>

      <Label class="login-label sign-up-label" @tap="toogle">
        <Span v-if="estInscrit" text="Si vous n'avez pas de compte, cliquez " />
        <Span v-else text="Si vous avez déjà un compte, cliquez " />
        <Span text="ici" class="bold" />
      </Label>
    </FlexboxLayout>
  </Page>
</template>
<script>
import axios from "axios";
import App from "./App";
import * as btoa from "btoa";
import { encode, decode } from "base-64";

const appSettings = require("tns-core-modules/application-settings");

export default {
  data() {
    return {
      estInscrit: true,
      user: {
        mail: "",
        mdp: "",
        nom: "",
        prenom: "",
        sexe: 0
      },
      sexe: ["Homme", "Femme"],
      urlInscription: "https://api.todolist.sherpa.one/users/signup",
      urlConnexion: "https://api.todolist.sherpa.one/users/signin"
    };
  },
  methods: {
    toogle() {
      this.estInscrit = !this.estInscrit;
    },
    submit() {
      if (this.estInscrit) {
        if (!this.user.mail || !this.user.mdp) {
          alert({
            title: "Erreur",
            okButtonText: "OK",
            message: "Adresse mail ou mot de passe incorrect"
          });
          return;
        }
        this.connexion();
      } else {
        if (!this.user.mail || !this.user.nom || !this.user.prenom) {
          alert({
            title: "Erreur",
            okButtonText: "OK",
            message: "Veuillez remplir tous les champs."
          });
          return;
        }
        this.inscription();
      }
    },
    connexion() {
      axios({
        method: "post",
        url: this.urlConnexion,
        auth: {
          username: this.user.mail,
          password: this.user.mdp
        }
      })
        .then(result => {
          appSettings.setString("user", JSON.stringify(result.data));
          this.$navigateTo(App);
          alert({
            title: "Succès",
            okButtonText: "OK",
            message: "Connexion réussie !"
          });
        })
        .catch(err => {
          alert({
            title: "Erreur",
            okButtonText: "OK",
            message: "Adresse mail ou mot de passe incorrect"
          });
        });
    },

    inscription() {
      let sexe = "male";
      if (this.user.sexe == 1) sexe = "female";

      axios({
        method: "post",
        url: this.urlInscription,
        data: {
          firstname: this.user.prenom,
          lastname: this.user.nom,
          email: this.user.mail,
          gender: sexe
        }
      })
        .then(result => {
          this.estInscrit = true;
          this.user.mdp = "";
          alert({
            title: "Succès",
            okButtonText: "OK",
            message:
              "Inscription réussie, Connectez vous avec : " +
              this.user.mail +
              " comme login et votre mot de passe est : " +
              result.data.password
          });
        })
        .catch(err => {
          if (err.response.data.error_description == "login must be an email")
            alert({
              title: "Erreur",
              okButtonText: "OK",
              message: "L'adresse email est invalide, réessayez."
            });
          else if (err.response.data.error_description)
            alert({
              title: "Erreur",
              okButtonText: "OK",
              message: "L'adresse email existe déjà."
            });
        });
    }
  },
  mounted: function() {
    if (!global.btoa) {
      global.btoa = encode;
    }
  }
};
</script>

<style scoped>
Page {
  background-color: white;
}
ActionBar {
  background-color: black;
  color: white;
}

.container {
  align-items: center;
  flex-direction: column;
}
.connex {
  margin-left: 30;
  margin-right: 30;
  flex-grow: 2;
  vertical-align: middle;
}

.input-field {
  margin-bottom: 25;
}

.input {
  font-size: 18;
  placeholder-color: #a8a8a8;
}

.input-field .input {
  font-size: 54;
}

.login-label {
  horizontal-align: center;
  color: #a8a8a8;
  font-size: 16;
}

.sign-up-label {
  margin-bottom: 20;
}

.bold {
  color: #000000;
}
</style>