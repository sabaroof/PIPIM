## Instrukcja

### Środowisko
Projekt został wykonany na maszynie wirtualnej z guest OS'em Manjaro Linux, dystrybucji bazującej na Arch Linux.
Wersja oprogramowania na której testowany był projekt: _20.0.1_

### Problemy
Głównym problemem z jakimś zetknąłem się podczas pracy nad projektem był CORS.

_CORS - Cross-Origin Resource Sharing – mechanizm umożliwiający współdzielenie zasobów pomiędzy serwerami znajdującymi się w różnych domenach._

W moim przypadku przeglądarka Firefox, na której początkowo pracowałem, blokowała odtwarzanie playlist HLS przechowywanych w katalogu /tests, ze względu na linkowanie ich w kodzie za pomocą URL 'file:///root...'.

By ominąć to zabezpieczenie, początkowo próbowałem zmieniać ustawienia przeglądarki i pobierać dodatkowe pluginy, jednak to nie pomagało. Następnie postanowiłem pushować playlisty na repozytorium i zmienić w kodzie URL playlist na 'https://github.com...', lecz to spowodowało błędy hlsManifestParsingError: No EXT3MU Delimiter.

W związku z tym, postanowiłem uruchomić serwer Apache i na nim hostować kod ze stroną, co również spowodowało problemy - Apache nie pozwalało na wczytanie lokalnych resource'ów (Not allowed to load local resources).

Aby obejść te ograniczenia, musiałem dodać nagłówek pozwalający na obejście tego zabezpieczenia w pliku httpd.conf, skonfigurować przeglądarkę Google Chrome oraz uruchamiać ją z odpowiednimi parametrami, a także zmienić w kodzie URL playlist na 'http://127.0.1.1/...'

jak postawic serwer apache na manjaro:


### Przygotowanie środowiska

* Krok 1: Pobierz repozytorium
```zsh
[msabadac-vm ~]# mkdir PIPIM
[msabadac-vm ~]# cd PIPIM
[msabadac-vm PIPIM]# git clone https://github.com/sabaroof/PIPIM.git
```

* Krok 2: Zainstaluj pakiet npm
```zsh
[msabadac-vm PIPIM]# sudo pacman -Ss npm
```

* Krok 3: Zainstaluj Apache ([Instrukcja](https://forum.manjaro.org/t/install-apache-mariadb-php-lamp-2016/1243))
```zsh
[msabadac-vm PIPIM]# sudo pacman -Syyu
[msabadac-vm PIPIM]# sudo pacman -S apache
```

* Krok 4: Edytuj plik httpd.conf
```zsh
[msabadac-vm PIPIM]# sudo vim /etc/httpd/conf/httpd.conf
```
Zakomentuj poniższą linię:
```
# LoadModule unique_id_module modules/mod_unique_id.so
```
Dodaj poniższy nagłówek w sekcji <Directory/>:
``` 
Header Set Access-Control-Allow-Origin "*" 
```

* Krok 5: Przenieś pobrane repozytorium do serwera Apache
```zsh
[msabadac-vm ~]# cp PIPIM /srv/http/
```

* Krok 6: Zainstaluj Google Chrome
```zsh
[msabadac-vm ~]# git clone https://aur.archlinux.org/google-chrome.git
[msabadac-vm ~]# cd google-chrome
[msabadac-vm google-chrome]# makepkg -s
[msabadac-vm google-chrome]# sudo pacman -U google-chrome*.tar.xz
```

### Uruchamianie

* Krok 1: Przejdź do repozytorium znajdującego się na serwerze Apache i wykonaj poniższe komendy npm
```zsh
[msabadac-vm PIPIM]# npm install
[msabadac-vm PIPIM]# npm audit fix
[msabadac-vm PIPIM]# npm run build
```

* Krok 2: Uruchom serwer Apache
```zsh
[msabadac-vm PIPIM]# sudo systemctl enable httpd
```

* Krok 3: Uruchom Google Chrome z poniższymi parametrami:pobrac repo i skopiowac zawartosc lokalnie na apache
```zsh
[msabadac-vm PIPIM]# google-chrome-stable --disable-web-security --no-sandbox -–allow-file-access-from-files
```

* Krok 4: Wejdź na stronę korzystając z URL:
```
http://127.0.1.1/PIPIM/demo/
```
