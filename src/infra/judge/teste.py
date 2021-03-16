ois = 0
gnomes = []


def oimundo():
    """
        Um simple Oi, mundo!
    """
    global ois
    ois += 1

    print("Oi, mundo!")


def oifulano(nome="fulan"):
    global ois, gnomes
    ois += 1
    if nome not in gnomes:
        gnomes.append(nome)
    print(f"Oi, {nome}!")


def oifulanos(*nomes):
    global ois, gnomes
    for nome in nomes:
        print(f"Oi, {nome}!")
        ois += 1
        if nome not in gnomes:
            gnomes.append(nome)


def oilista(nomes, esvaziar=False):
    global ois, gnomes
    for nome in nomes:
        print(f"Oi, {nome}!")
        ois += 1
        if nome not in gnomes:
            gnomes.append(nome)
    if (esvaziar):
        nomes.clear()


def qtois():
    global ois
    return ois


def cumprimentados():
    global gnomes
    return gnomes


def existerepetidos(lista):
    if len(lista) != len(set(lista)):
        return True
    else:
        return False
